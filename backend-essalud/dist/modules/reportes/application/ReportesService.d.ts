import { ReportesRepository, ResumenReportes, PacienteReporte, PersonalReporte, ConsultaReporte } from '../domain/ReportesRepository';
export declare class ReportesService {
    private readonly reportesRepository;
    constructor(reportesRepository: ReportesRepository);
    obtenerResumen(): Promise<ResumenReportes>;
    listarCitasReporte(fechaInicio?: string, fechaFin?: string, idEspecialidad?: string, estado?: string): Promise<any[]>;
    listarPacientesReporte(): Promise<PacienteReporte[]>;
    listarPersonalReporte(rol?: string, idEspecialidad?: string): Promise<PersonalReporte[]>;
    listarConsultasReporte(fechaInicio?: string, fechaFin?: string, idEspecialidad?: string): Promise<ConsultaReporte[]>;
    generarExcelCitas(fechaInicio?: string, fechaFin?: string, idEspecialidad?: string, estado?: string): Promise<Buffer>;
    generarExcelPacientes(): Promise<Buffer>;
    generarExcelPersonal(rol?: string, idEspecialidad?: string): Promise<Buffer>;
    generarExcelConsultas(fechaInicio?: string, fechaFin?: string, idEspecialidad?: string): Promise<Buffer>;
    generarExcelMedicamentosBajoStock(): Promise<Buffer>;
    generarExcelMedicamentosPorVencer(): Promise<Buffer>;
    private generarExcelMedicamentos;
    private aplicarAlineacion;
}
//# sourceMappingURL=ReportesService.d.ts.map