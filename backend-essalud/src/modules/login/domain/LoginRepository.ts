import { Usuario } from './Usuario';

export interface LoginRepository {
    buscarPorDni(dni: string): Promise<Usuario | null>;

    actualizarEstado(usuario: Usuario): Promise<void>;
}