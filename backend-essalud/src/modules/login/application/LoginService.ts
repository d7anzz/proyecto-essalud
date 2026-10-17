import { LoginDTO } from './LoginDTO';
import { LoginRepository } from '../domain/LoginRepository';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class LoginService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'essalud_secret_key_2026';

    constructor(private readonly authRepository: LoginRepository) {}
    async ejecutar(data: LoginDTO): Promise<{ token: string; dni: string; idRol: number; requiereCambio?: boolean }> {
        const usuario = await this.authRepository.buscarPorDni(data.dni);
        if (!usuario) {
            throw new Error('Credenciales incorrectas');
        }
        if (!usuario.estaActivo()) {
            throw new Error('La cuenta se encuentra bloqueada por exceso de intentos fallidos. Contacte al administrador.');
        }
        const passwordValido = await bcrypt.compare(data.passwordIn, usuario.passwordHash);

        if (!passwordValido) {
            usuario.registrarIntentoFallido();
            await this.authRepository.actualizarEstado(usuario);
            throw new Error('Credenciales incorrectas');
        }
        if (usuario.intentosFallidos > 0) {
            usuario.limpiarIntentos();
            await this.authRepository.actualizarEstado(usuario);
        }
        if (usuario.requiereCambioPassword) {
            return {
                token: '', 
                dni: usuario.dni,
                idRol: usuario.idRol,
                requiereCambio: true 
            };
        }
        const token = jwt.sign(
            { dni: usuario.dni, id_rol: usuario.idRol },
            this.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        return {
            token,
            dni: usuario.dni,
            idRol: usuario.idRol,
            requiereCambio: false
        };
    }
}