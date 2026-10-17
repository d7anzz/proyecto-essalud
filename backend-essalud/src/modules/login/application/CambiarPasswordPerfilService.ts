import { LoginRepository } from '../domain/LoginRepository';
import bcrypt from 'bcryptjs';

export class CambiarPasswordPerfilService {
    // Inyectamos la interfaz del repositorio de dominio de manera ordenada
    constructor(private readonly authRepository: LoginRepository) {} 

    async ejecutar(dto: { dni: string; passwordActual: string; passwordNueva: string }): Promise<void> {
        // 1. Buscar al operador en MySQL usando tu repositorio de dominio
        const usuario = await this.authRepository.buscarPorDni(dto.dni);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // 2. Verificar criptográficamente la contraseña actual usando bcryptjs
        const esValida = await bcrypt.compare(dto.passwordActual, usuario.passwordHash);
        if (!esValida) {
            throw new Error('La contraseña actual ingresada es incorrecta.');
        }

        // 3. Cifrar la nueva contraseña voluntaria
        const salt = await bcrypt.genSalt(10);
        const nuevoHash = await bcrypt.hash(dto.passwordNueva, salt);

        // 4. Modificar el estado de la entidad mediante su método encapsulado público
        // Esto evita el error de asignación directa sobre propiedades protegidas o de solo lectura
        usuario.actualizarPasswordInicial(nuevoHash);

        // 5. PERSISTENCIA REAL: Sincronizamos la entidad de dominio mutada con la base de datos
        await this.authRepository.actualizarEstado(usuario);
        
        console.log(`✅ Contraseña guardada con éxito en MySQL mediante Repositorio de Dominio para DNI: ${dto.dni}`);
    }
}