import { Personal } from './Personal';
import { Usuario } from '../../login/domain/Usuario';
export interface PersonalRepository {
    existePorDni(dni: string): Promise<boolean>;
    guardarPersonalYCredenciales(usuario: Usuario, personal: Personal): Promise<void>;
    obtenerEspecialidadPorDni(dni: string): Promise<number | null>;
}
//# sourceMappingURL=PersonalRepository.d.ts.map