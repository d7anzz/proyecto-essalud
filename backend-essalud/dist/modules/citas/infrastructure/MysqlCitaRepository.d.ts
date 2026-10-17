import { DataSource } from 'typeorm';
import { CitaRepository } from '../domain/CitaRepository';
import { Cita } from '../domain/Cita';
export declare class MysqlCitaRepository implements CitaRepository {
    private readonly repo;
    constructor(dataSource: DataSource);
    crear(cita: Cita): Promise<Cita>;
    listar(): Promise<Cita[]>;
    obtenerPorId(id: number): Promise<Cita | null>;
    actualizar(id: number, datos: Partial<Cita>): Promise<Cita | null>;
    eliminar(id: number): Promise<boolean>;
}
//# sourceMappingURL=MysqlCitaRepository.d.ts.map