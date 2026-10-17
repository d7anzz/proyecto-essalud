import { CitaRepository } from '../domain/CitaRepository';
import { Cita } from '../domain/Cita';
import { HorarioRepository } from '../../registro-horario/domain/HorarioRepository';
import { CrearCitaDTO } from './CrearCitaDTO';
export declare class CitaService {
    private readonly repo;
    private readonly horarioRepo;
    private readonly ROL_ADMINISTRATIVO;
    private readonly ROL_MEDICO;
    constructor(repo: CitaRepository, horarioRepo: HorarioRepository);
    crear(dto: CrearCitaDTO, rolEjecutor: number): Promise<Cita>;
    listar(rolEjecutor: number, dniUsuarioLogueado: string): Promise<Cita[]>;
    obtenerPorId(id: number, rolEjecutor: number, dniUsuarioLogueado: string): Promise<Cita | null>;
    actualizar(id: number, data: Partial<Cita>, rolEjecutor: number): Promise<Cita | null>;
    eliminar(id: number, rolEjecutor: number): Promise<boolean>;
}
//# sourceMappingURL=CitaService.d.ts.map