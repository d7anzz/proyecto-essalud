import { Router } from 'express';
import { ConsultaController } from './ConsultaController';
import { verificarJWT } from '../../../shared/middlewares/authMiddleware'; // Ajusta la ruta a tu middleware real

export const configurarRutasConsulta = (controlador: ConsultaController): Router => {
  const router = Router();

  // 🩺 Endpoint exclusivo protegido por JSON Web Tokens para el acto médico
  router.post('/', verificarJWT, controlador.crear);

  return router;
};