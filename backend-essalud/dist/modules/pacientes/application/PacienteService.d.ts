import { Paciente } from '../domain/Paciente';
import { PacienteRepository } from '../domain/PacienteRepository';
import { CreatePacienteDTO } from './CrearPacienteDTO';
export declare class PacienteService {
    private pacienteRepository;
    private readonly ROLES_PERMITIDOS;
    constructor(pacienteRepository: PacienteRepository);
    ejecutar(dto: CreatePacienteDTO, rolEjecutor: number): Promise<void>;
    listarPacientes(): Promise<Paciente[]>;
    buscarPorDni(dni: string): Promise<Paciente[]>;
    actualizarPaciente(dni: string, dto: any): Promise<void>;
    eliminarPaciente(dni: string): Promise<void>;
}
//# sourceMappingURL=PacienteService.d.ts.map