import { Horario } from './Horario';
export interface HorarioRepository {
    crear(horario: Horario): Promise<Horario>;
    listar(): Promise<Horario[]>;
    obtenerPorId(id: number): Promise<Horario | null>;
    actualizar(id: number, datos: Partial<Horario>): Promise<Horario | null>;
    eliminar(id: number): Promise<boolean>;
    buscarPorMedicoYFecha(dni: string, fecha: string): Promise<Horario[]>;
}
//# sourceMappingURL=HorarioRepository.d.ts.map