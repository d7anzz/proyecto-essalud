"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesController = void 0;
class ReportesController {
    reportesService;
    constructor(reportesService) {
        this.reportesService = reportesService;
    }
    async obtenerResumen(req, res) {
        try {
            const resumen = await this.reportesService.obtenerResumen();
            res.status(200).json({
                ok: true,
                data: resumen
            });
        }
        catch (error) {
            console.error('[ReportesController] Error al obtener resumen:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al obtener el resumen de reportes.',
                error: error.message
            });
        }
    }
    async listarCitasReporte(req, res) {
        try {
            const { fechaInicio, fechaFin, idEspecialidad, estado } = req.query;
            const citas = await this.reportesService.listarCitasReporte(fechaInicio, fechaFin, idEspecialidad, estado);
            res.status(200).json({
                ok: true,
                data: citas
            });
        }
        catch (error) {
            console.error('[ReportesController] Error al listar reporte de citas:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al listar el reporte de citas.',
                error: error.message
            });
        }
    }
    async descargarCitasExcel(req, res) {
        try {
            const { fechaInicio, fechaFin, idEspecialidad, estado } = req.query;
            const excelBuffer = await this.reportesService.generarExcelCitas(fechaInicio, fechaFin, idEspecialidad, estado);
            const nombreArchivo = `reporte_citas_${estado || 'TODAS'}_${fechaInicio || 'inicio'}_${fechaFin || 'fin'}.xlsx`;
            this.enviarExcel(res, excelBuffer, nombreArchivo);
        }
        catch (error) {
            console.error('[ReportesController] Error al descargar Excel de citas:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al generar el Excel de citas.',
                error: error.message
            });
        }
    }
    async descargarPacientesExcel(req, res) {
        try {
            const excelBuffer = await this.reportesService.generarExcelPacientes();
            this.enviarExcel(res, excelBuffer, 'reporte_pacientes.xlsx');
        }
        catch (error) {
            console.error('[ReportesController] Error al descargar Excel de pacientes:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al generar el Excel de pacientes.',
                error: error.message
            });
        }
    }
    async listarPersonalReporte(req, res) {
        try {
            const { rol, idEspecialidad } = req.query;
            const personal = await this.reportesService.listarPersonalReporte(rol, idEspecialidad);
            res.status(200).json({
                ok: true,
                data: personal
            });
        }
        catch (error) {
            console.error('[ReportesController] Error al listar reporte de personal:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al listar el reporte de personal.',
                error: error.message
            });
        }
    }
    async descargarPersonalExcel(req, res) {
        try {
            const { rol, idEspecialidad } = req.query;
            const excelBuffer = await this.reportesService.generarExcelPersonal(rol, idEspecialidad);
            const nombreArchivo = `reporte_personal_${rol || 'TODOS'}.xlsx`;
            this.enviarExcel(res, excelBuffer, nombreArchivo);
        }
        catch (error) {
            console.error('[ReportesController] Error al descargar Excel de personal:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al generar el Excel de personal.',
                error: error.message
            });
        }
    }
    async listarConsultasReporte(req, res) {
        try {
            const { fechaInicio, fechaFin, idEspecialidad } = req.query;
            const consultas = await this.reportesService.listarConsultasReporte(fechaInicio, fechaFin, idEspecialidad);
            res.status(200).json({
                ok: true,
                data: consultas
            });
        }
        catch (error) {
            console.error('[ReportesController] Error al listar reporte de consultas:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al listar el reporte de consultas médicas.',
                error: error.message
            });
        }
    }
    async descargarConsultasExcel(req, res) {
        try {
            const { fechaInicio, fechaFin, idEspecialidad } = req.query;
            const excelBuffer = await this.reportesService.generarExcelConsultas(fechaInicio, fechaFin, idEspecialidad);
            const nombreArchivo = `reporte_consultas_${fechaInicio || 'inicio'}_${fechaFin || 'fin'}.xlsx`;
            this.enviarExcel(res, excelBuffer, nombreArchivo);
        }
        catch (error) {
            console.error('[ReportesController] Error al descargar Excel de consultas:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al generar el Excel de consultas médicas.',
                error: error.message
            });
        }
    }
    async descargarMedicamentosBajoStockExcel(req, res) {
        try {
            const excelBuffer = await this.reportesService.generarExcelMedicamentosBajoStock();
            this.enviarExcel(res, excelBuffer, 'reporte_medicamentos_bajo_stock.xlsx');
        }
        catch (error) {
            console.error('[ReportesController] Error al descargar Excel de medicamentos bajo stock:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al generar el Excel de medicamentos bajo stock.',
                error: error.message
            });
        }
    }
    async descargarMedicamentosPorVencerExcel(req, res) {
        try {
            const excelBuffer = await this.reportesService.generarExcelMedicamentosPorVencer();
            this.enviarExcel(res, excelBuffer, 'reporte_medicamentos_por_vencer.xlsx');
        }
        catch (error) {
            console.error('[ReportesController] Error al descargar Excel de medicamentos por vencer:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al generar el Excel de medicamentos por vencer.',
                error: error.message
            });
        }
    }
    enviarExcel(res, excelBuffer, nombreArchivo) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
        res.send(excelBuffer);
    }
}
exports.ReportesController = ReportesController;
//# sourceMappingURL=ReportesController.js.map