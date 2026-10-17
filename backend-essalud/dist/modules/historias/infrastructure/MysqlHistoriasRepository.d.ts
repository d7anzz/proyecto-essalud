import { DataSource } from 'typeorm';
import { HistoriaClinica, HistoriasRepository } from '../domain/HistoriasRepository';
export declare class MysqlHistoriasRepository implements HistoriasRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    obtenerHistoriaPorDni(dniPaciente: string): Promise<HistoriaClinica | null>;
}
//# sourceMappingURL=MysqlHistoriasRepository.d.ts.map