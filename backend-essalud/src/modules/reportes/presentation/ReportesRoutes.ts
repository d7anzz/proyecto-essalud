import { Router } from 'express';
import { DataSource } from 'typeorm';

import { MysqlReportesRepository } from '../infrastructure/MysqlReportesRepository';
import { ReportesService } from '../application/ReportesService';
import { ReportesController } from './ReportesController';

export const configurarRutasReportes = (dataSource: DataSource): Router => {
  const router = Router();

  const reportesRepository = new MysqlReportesRepository(dataSource);
  const reportesService = new ReportesService(reportesRepository);
  const reportesController = new ReportesController(reportesService);

  router.get('/resumen', (req, res) =>
    reportesController.obtenerResumen(req, res)
  );

  router.get('/pacientes/excel', (req, res) =>
    reportesController.descargarPacientesExcel(req, res)
  );

  router.get('/personal', (req, res) =>
    reportesController.listarPersonalReporte(req, res)
  );

  router.get('/personal/excel', (req, res) =>
    reportesController.descargarPersonalExcel(req, res)
  );

  router.get('/consultas', (req, res) =>
    reportesController.listarConsultasReporte(req, res)
  );

  router.get('/consultas/excel', (req, res) =>
    reportesController.descargarConsultasExcel(req, res)
  );

  router.get('/medicamentos/bajo-stock/excel', (req, res) =>
    reportesController.descargarMedicamentosBajoStockExcel(req, res)
  );

  router.get('/medicamentos/por-vencer/excel', (req, res) =>
    reportesController.descargarMedicamentosPorVencerExcel(req, res)
  );

  router.get('/citas', (req, res) =>
    reportesController.listarCitasReporte(req, res)
  );

  router.get('/citas/excel', (req, res) =>
    reportesController.descargarCitasExcel(req, res)
  );

  return router;
};