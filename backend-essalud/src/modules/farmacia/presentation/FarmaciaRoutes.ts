import { Router } from 'express';
import { FarmaciaController } from './FarmaciaController';
import { verificarJWT } from '../../../shared/middlewares/authMiddleware';

export const configurarRutasFarmacia = (controlador: FarmaciaController): Router => {
  const router = Router();
  router.get('/inventario', verificarJWT, controlador.listarInventario);
  router.post('/inventario', verificarJWT, controlador.agregarMedicamento);
  router.get('/recetas', verificarJWT, controlador.listarRecetas);
  router.put('/despachar', verificarJWT, controlador.entregarReceta);

  return router;
};