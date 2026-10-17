import { Cita } from './Cita';

export interface CitaRepository {
  crear(cita: Cita): Promise<Cita>;
  listar(): Promise<Cita[]>;
  obtenerPorId(id: number): Promise<Cita | null>;
  actualizar(id: number, datos: Partial<Cita>): Promise<Cita | null>;
  eliminar(id: number): Promise<boolean>;
}