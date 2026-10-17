import { Paciente } from '../domain/Paciente';
import { PacienteModel } from './PacienteModel';
export declare class PacienteMapper {
    static toDomain(model: PacienteModel): Paciente;
    static toPersistence(paciente: Paciente): PacienteModel;
}
//# sourceMappingURL=PacienteMapper.d.ts.map