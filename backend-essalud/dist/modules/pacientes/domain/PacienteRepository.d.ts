import { Paciente } from './Paciente';
export interface PacienteRepository {
    guardar(paciente: Paciente): Promise<void>;
    buscarPorDni(dni: string): Promise<Paciente | null>;
    buscarCoincidenciasPorDni(dni: string): Promise<Paciente[]>;
    obtenerTodos(): Promise<Paciente[]>;
    eliminarPorDni(dni: string): Promise<void>;
}
//# sourceMappingURL=PacienteRepository.d.ts.map