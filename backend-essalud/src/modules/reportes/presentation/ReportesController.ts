import { Request, Response } from 'express';
import { ReportesService } from '../application/ReportesService';

export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  async obtenerResumen(req: Request, res: Response): Promise<void> {
    try {
      const resumen = await this.reportesService.obtenerResumen();

      res.status(200).json({
        ok: true,
        data: resumen
      });
    } catch (error: any) {
      console.error('[ReportesController] Error al obtener resumen:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al obtener el resumen de reportes.',
        error: error.message
      });
    }
  }

  async listarCitasReporte(req: Request, res: Response): Promise<void> {
    try {
      const { fechaInicio, fechaFin, idEspecialidad, estado } = req.query;

      const citas = await this.reportesService.listarCitasReporte(
        fechaInicio as string,
        fechaFin as string,
        idEspecialidad as string,
        estado as string
      );

      res.status(200).json({
        ok: true,
        data: citas
      });
    } catch (error: any) {
      console.error('[ReportesController] Error al listar reporte de citas:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al listar el reporte de citas.',
        error: error.message
      });
    }
  }

  async descargarCitasExcel(req: Request, res: Response): Promise<void> {
    try {
      const { fechaInicio, fechaFin, idEspecialidad, estado } = req.query;

      const excelBuffer = await this.reportesService.generarExcelCitas(
        fechaInicio as string,
        fechaFin as string,
        idEspecialidad as string,
        estado as string
      );

      const nombreArchivo = `reporte_citas_${estado || 'TODAS'}_${fechaInicio || 'inicio'}_${fechaFin || 'fin'}.xlsx`;

      this.enviarExcel(res, excelBuffer, nombreArchivo);
    } catch (error: any) {
      console.error('[ReportesController] Error al descargar Excel de citas:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al generar el Excel de citas.',
        error: error.message
      });
    }
  }

  async descargarPacientesExcel(req: Request, res: Response): Promise<void> {
    try {
      const excelBuffer = await this.reportesService.generarExcelPacientes();

      this.enviarExcel(res, excelBuffer, 'reporte_pacientes.xlsx');
    } catch (error: any) {
      console.error('[ReportesController] Error al descargar Excel de pacientes:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al generar el Excel de pacientes.',
        error: error.message
      });
    }
  }

  async listarPersonalReporte(req: Request, res: Response): Promise<void> {
    try {
      const { rol, idEspecialidad } = req.query;

      const personal = await this.reportesService.listarPersonalReporte(
        rol as string,
        idEspecialidad as string
      );

      res.status(200).json({
        ok: true,
        data: personal
      });
    } catch (error: any) {
      console.error('[ReportesController] Error al listar reporte de personal:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al listar el reporte de personal.',
        error: error.message
      });
    }
  }

  async descargarPersonalExcel(req: Request, res: Response): Promise<void> {
    try {
      const { rol, idEspecialidad } = req.query;

      const excelBuffer = await this.reportesService.generarExcelPersonal(
        rol as string,
        idEspecialidad as string
      );

      const nombreArchivo = `reporte_personal_${rol || 'TODOS'}.xlsx`;

      this.enviarExcel(res, excelBuffer, nombreArchivo);
    } catch (error: any) {
      console.error('[ReportesController] Error al descargar Excel de personal:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al generar el Excel de personal.',
        error: error.message
      });
    }
  }

  async listarConsultasReporte(req: Request, res: Response): Promise<void> {
    try {
      const { fechaInicio, fechaFin, idEspecialidad } = req.query;

      const consultas = await this.reportesService.listarConsultasReporte(
        fechaInicio as string,
        fechaFin as string,
        idEspecialidad as string
      );

      res.status(200).json({
        ok: true,
        data: consultas
      });
    } catch (error: any) {
      console.error('[ReportesController] Error al listar reporte de consultas:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al listar el reporte de consultas médicas.',
        error: error.message
      });
    }
  }

  async descargarConsultasExcel(req: Request, res: Response): Promise<void> {
    try {
      const { fechaInicio, fechaFin, idEspecialidad } = req.query;

      const excelBuffer = await this.reportesService.generarExcelConsultas(
        fechaInicio as string,
        fechaFin as string,
        idEspecialidad as string
      );

      const nombreArchivo = `reporte_consultas_${fechaInicio || 'inicio'}_${fechaFin || 'fin'}.xlsx`;

      this.enviarExcel(res, excelBuffer, nombreArchivo);
    } catch (error: any) {
      console.error('[ReportesController] Error al descargar Excel de consultas:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al generar el Excel de consultas médicas.',
        error: error.message
      });
    }
  }

  async descargarMedicamentosBajoStockExcel(req: Request, res: Response): Promise<void> {
    try {
      const excelBuffer = await this.reportesService.generarExcelMedicamentosBajoStock();

      this.enviarExcel(res, excelBuffer, 'reporte_medicamentos_bajo_stock.xlsx');
    } catch (error: any) {
      console.error('[ReportesController] Error al descargar Excel de medicamentos bajo stock:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al generar el Excel de medicamentos bajo stock.',
        error: error.message
      });
    }
  }

  async descargarMedicamentosPorVencerExcel(req: Request, res: Response): Promise<void> {
    try {
      const excelBuffer = await this.reportesService.generarExcelMedicamentosPorVencer();

      this.enviarExcel(res, excelBuffer, 'reporte_medicamentos_por_vencer.xlsx');
    } catch (error: any) {
      console.error('[ReportesController] Error al descargar Excel de medicamentos por vencer:', error.message);

      res.status(500).json({
        ok: false,
        message: 'Error al generar el Excel de medicamentos por vencer.',
        error: error.message
      });
    }
  }

  private enviarExcel(res: Response, excelBuffer: Buffer, nombreArchivo: string): void {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${nombreArchivo}"`
    );

    res.send(excelBuffer);
  }
}