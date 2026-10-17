import { DataSource } from 'typeorm';
import { ReportesRepository, ResumenReportes, CitaReporte, PacienteReporte, PersonalReporte, ConsultaReporte, MedicamentoReporte } from '../domain/ReportesRepository';
export declare class MysqlReportesRepository implements ReportesRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private contar;
    obtenerResumen(): Promise<ResumenReportes>;
    listarCitasReporte(fechaInicio?: string, fechaFin?: string, idEspecialidad?: string, estado?: string): Promise<CitaReporte[]>;
    listarPacientesReporte(): Promise<PacienteReporte[]>;
    listarPersonalReporte(rol?: string, idEspecialidad?: string): Promise<PersonalReporte[]>;
    listarConsultasReporte(fechaInicio?: string, fechaFin?: string, idEspecialidad?: string): Promise<ConsultaReporte[]>;
    listarMedicamentosBajoStock(): Promise<MedicamentoReporte[]>;
    listarMedicamentosPorVencer(): Promise<MedicamentoReporte[]>;
}
//# sourceMappingURL=MysqlReportesRepository.d.ts.map