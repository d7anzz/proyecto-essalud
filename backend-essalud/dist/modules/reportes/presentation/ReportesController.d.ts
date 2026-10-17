import { Request, Response } from 'express';
import { ReportesService } from '../application/ReportesService';
export declare class ReportesController {
    private readonly reportesService;
    constructor(reportesService: ReportesService);
    obtenerResumen(req: Request, res: Response): Promise<void>;
    listarCitasReporte(req: Request, res: Response): Promise<void>;
    descargarCitasExcel(req: Request, res: Response): Promise<void>;
    descargarPacientesExcel(req: Request, res: Response): Promise<void>;
    listarPersonalReporte(req: Request, res: Response): Promise<void>;
    descargarPersonalExcel(req: Request, res: Response): Promise<void>;
    listarConsultasReporte(req: Request, res: Response): Promise<void>;
    descargarConsultasExcel(req: Request, res: Response): Promise<void>;
    descargarMedicamentosBajoStockExcel(req: Request, res: Response): Promise<void>;
    descargarMedicamentosPorVencerExcel(req: Request, res: Response): Promise<void>;
    private enviarExcel;
}
//# sourceMappingURL=ReportesController.d.ts.map