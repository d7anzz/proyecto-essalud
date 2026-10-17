import { LoginRepository } from '../domain/LoginRepository';
import bcrypt from 'bcryptjs';

export interface ActualizarPasswordDTO {
    dni: string;
    nuevaPassword: string;
}

export class ActualizarPasswordInicialService {
    constructor(private readonly authRepository: LoginRepository) {}

    async ejecutar(data: ActualizarPasswordDTO): Promise<void> {
        const usuario = await this.authRepository.buscarPorDni(data.dni);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        const salt = await bcrypt.genSalt(10);
        const nuevoHash = await bcrypt.hash(data.nuevaPassword, salt);
        
        usuario.actualizarPasswordInicial(nuevoHash);

        await this.authRepository.actualizarEstado(usuario);
    }
}