import { Router } from 'express';
import { DataSource } from 'typeorm';

import { MysqlHistoriasRepository } from '../infrastructure/MysqlHistoriasRepository';
import { HistoriasService } from '../application/HistoriasService';
import { HistoriasController } from './HistoriasController';

export const configurarRutasHistorias = (dataSource: DataSource): Router => {
  const router = Router();

  const historiasRepository = new MysqlHistoriasRepository(dataSource);
  const historiasService = new HistoriasService(historiasRepository);
  const historiasController = new HistoriasController(historiasService);

  router.get('/:dniPaciente', (req, res) => {
    historiasController.obtenerHistoriaPorDni(req, res);
  });

  return router;
};