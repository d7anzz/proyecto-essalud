import { DataSource } from 'typeorm';
import { PersonalRepository } from '../domain/PersonalRepository';
import { Personal } from '../domain/Personal';
import { Usuario } from '../../login/domain/Usuario';
export declare class MysqlPersonalRepository implements PersonalRepository {
    private readonly dataSource;
    private readonly personalRepo;
    private readonly usuarioRepo;
    constructor(dataSource: DataSource);
    existePorDni(dni: string): Promise<boolean>;
    obtenerEspecialidadPorDni(dni: string): Promise<number | null>;
    guardarPersonalYCredenciales(usuario: Usuario, personal: Personal): Promise<void>;
}
//# sourceMappingURL=MysqlPersonaRepository.d.ts.map