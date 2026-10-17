import { DataSource } from 'typeorm';
import { HorarioRepository } from '../domain/HorarioRepository';
import { Horario } from '../domain/Horario';
export declare class MysqlHorarioRepository implements HorarioRepository {
    private readonly repo;
    constructor(dataSource: DataSource);
    crear(horario: Horario): Promise<Horario>;
    listar(): Promise<Horario[]>;
    obtenerPorId(id: number): Promise<Horario | null>;
    actualizar(id: number, datos: Partial<Horario>): Promise<Horario | null>;
    eliminar(id: number): Promise<boolean>;
    buscarPorMedicoYFecha(dni: string, fecha: string): Promise<Horario[]>;
}
//# sourceMappingURL=MysqlHorarioRepository.d.ts.map