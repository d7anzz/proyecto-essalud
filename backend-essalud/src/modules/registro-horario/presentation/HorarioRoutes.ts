import { Router } from 'express';
import { HorarioController } from './HorarioController';
import { verificarJWT } from '../../../shared/middlewares/authMiddleware';

export const configurarRutasHorario = (controlador: HorarioController): Router => {
  const router = Router();

  router.get('/',       verificarJWT, controlador.listar);
  router.get('/:id',    verificarJWT, controlador.obtenerPorId);
  router.post('/',      verificarJWT, controlador.crear);
  router.put('/:id',    verificarJWT, controlador.actualizar);
  router.delete('/:id', verificarJWT, controlador.eliminar);

  return router;
};