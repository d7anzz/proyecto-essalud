import { HorarioRepository } from '../domain/HorarioRepository';
import { Horario } from '../domain/Horario';
import { CrearHorarioDTO } from './CrearHorarioDTO';
export declare class HorarioService {
    private readonly repo;
    private readonly ROLES_PERMITIDOS;
    private readonly DURACION_CITA_MINUTOS;
    private readonly INTERVALO_HOLGURA_MINUTOS;
    private readonly ROL_MEDICO;
    constructor(repo: HorarioRepository);
    crear(dto: CrearHorarioDTO, rolEjecutor: number): Promise<Horario>;
    listar(rolEjecutor: number, dniEjecutor: string): Promise<Horario[]>;
    obtenerPorId(id: number): Promise<Horario | null>;
    actualizar(id: number, datos: Partial<Horario>, rolEjecutor: number): Promise<Horario | null>;
    eliminar(id: number, rolEjecutor: number): Promise<boolean>;
    private timeToMinutes;
    private minutesToTime;
    private validarLimitesTurno;
    private verificarChoqueDeHoras;
}
//# sourceMappingURL=HorarioService.d.ts.map