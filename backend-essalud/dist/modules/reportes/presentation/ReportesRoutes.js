"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarRutasReportes = void 0;
const express_1 = require("express");
const MysqlReportesRepository_1 = require("../infrastructure/MysqlReportesRepository");
const ReportesService_1 = require("../application/ReportesService");
const ReportesController_1 = require("./ReportesController");
const configurarRutasReportes = (dataSource) => {
    const router = (0, express_1.Router)();
    const reportesRepository = new MysqlReportesRepository_1.MysqlReportesRepository(dataSource);
    const reportesService = new ReportesService_1.ReportesService(reportesRepository);
    const reportesController = new ReportesController_1.ReportesController(reportesService);
    router.get('/resumen', (req, res) => reportesController.obtenerResumen(req, res));
    router.get('/pacientes/excel', (req, res) => reportesController.descargarPacientesExcel(req, res));
    router.get('/personal', (req, res) => reportesController.listarPersonalReporte(req, res));
    router.get('/personal/excel', (req, res) => reportesController.descargarPersonalExcel(req, res));
    router.get('/consultas', (req, res) => reportesController.listarConsultasReporte(req, res));
    router.get('/consultas/excel', (req, res) => reportesController.descargarConsultasExcel(req, res));
    router.get('/medicamentos/bajo-stock/excel', (req, res) => reportesController.descargarMedicamentosBajoStockExcel(req, res));
    router.get('/medicamentos/por-vencer/excel', (req, res) => reportesController.descargarMedicamentosPorVencerExcel(req, res));
    router.get('/citas', (req, res) => reportesController.listarCitasReporte(req, res));
    router.get('/citas/excel', (req, res) => reportesController.descargarCitasExcel(req, res));
    return router;
};
exports.configurarRutasReportes = configurarRutasReportes;
//# sourceMappingURL=ReportesRoutes.js.map