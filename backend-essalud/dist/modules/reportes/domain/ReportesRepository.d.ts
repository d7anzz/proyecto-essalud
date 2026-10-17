export interface ResumenReportes {
    totalPacientes: number;
    totalPersonal: number;
    citasPendientes: number;
    citasCompletadas: number;
    citasCanceladas: number;
    totalConsultas: number;
    medicamentosBajoStock: number;
    medicamentosPorVencer: number;
}
export interface CitaReporte {
    idCita: number;
    dniPaciente: string;
    paciente: string;
    medico: string;
    especialidad: string | null;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    turno: string;
    estado: string;
}
export interface PacienteReporte {
    dni: string;
    nombre: string;
    apellidos: string;
    fecNac: string;
}
export interface PersonalReporte {
    dni: string;
    nombre: string;
    apellidos: string;
    rol: string;
    colegiatura: string | null;
    especialidad: string | null;
}
export interface ConsultaReporte {
    idConsulta: number;
    idCita: number;
    dniPaciente: string;
    paciente: string;
    medico: string;
    especialidad: string | null;
    diagnostico: string;
    observaciones: string | null;
    fechaAtencion: string;
    estadoCita: string;
}
export interface MedicamentoReporte {
    idMedicamento: number;
    nombreMedicamento: string;
    composicion: string;
    stockActual: number;
    stockMinimo: number;
    fechaVencimiento: string;
}
export interface ReportesRepository {
    obtenerResumen(): Promise<ResumenReportes>;
    listarCitasReporte(fechaInicio?: string, fechaFin?: string, idEspecialidad?: string, estado?: string): Promise<CitaReporte[]>;
    listarPacientesReporte(): Promise<PacienteReporte[]>;
    listarPersonalReporte(rol?: string, idEspecialidad?: string): Promise<PersonalReporte[]>;
    listarConsultasReporte(fechaInicio?: string, fechaFin?: string, idEspecialidad?: string): Promise<ConsultaReporte[]>;
    listarMedicamentosBajoStock(): Promise<MedicamentoReporte[]>;
    listarMedicamentosPorVencer(): Promise<MedicamentoReporte[]>;
}
//# sourceMappingURL=ReportesRepository.d.ts.map