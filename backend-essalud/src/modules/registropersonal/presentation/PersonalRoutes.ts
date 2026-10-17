import { Router } from 'express';
import { PersonalController } from './PersonalController';

export function configurarRutasPersonal(controller: PersonalController) {
  const personalRouter = Router();

  // Ruta principal usada por el frontend:
  // POST /api/personal
  personalRouter.post('/', (req, res) => controller.registrar(req, res));

  // Ruta alternativa antigua:
  // POST /api/personal/registrar
  personalRouter.post('/registrar', (req, res) => controller.registrar(req, res));

  return personalRouter;
}