import { Repository } from 'typeorm';
import { Paciente } from '../domain/Paciente';
import { PacienteRepository } from '../domain/PacienteRepository';
import { PacienteModel } from './PacienteModel';
export declare class MysqlPacienteRepository implements PacienteRepository {
    private ormRepository;
    constructor(ormRepository: Repository<PacienteModel>);
    guardar(paciente: Paciente): Promise<void>;
    buscarPorDni(dni: string): Promise<Paciente | null>;
    buscarCoincidenciasPorDni(dni: string): Promise<Paciente[]>;
    obtenerTodos(): Promise<Paciente[]>;
    eliminarPorDni(dni: string): Promise<void>;
}
//# sourceMappingURL=MysqlPacienteRepository.d.ts.map