import { PacienteModel } from '../../pacientes/infrastructure/PacienteModel';
import { HorarioModel } from '../../registro-horario/infrastructure/HorarioModel';
export declare class CitaModel {
    idCita: number;
    dniPaciente: string;
    idMedico: string;
    idHorario: number;
    estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
    fechaCreacion: Date;
    paciente: PacienteModel;
    horario: HorarioModel;
}
//# sourceMappingURL=CitaModel.d.ts.map