import { Router } from 'express';
import { PacientesController } from './PacienteController';
import { verificarJWT } from '../../../shared/middlewares/authMiddleware';

const pacientesRouter = Router();

export function configurarRutasPacientes(controller: PacientesController) {
  pacientesRouter.post('/', verificarJWT, controller.crearPaciente);
  pacientesRouter.get('/', verificarJWT, controller.listarPacientes); 
  pacientesRouter.get('/buscar/:dni', verificarJWT, controller.buscarPorDni);
  pacientesRouter.put('/:dni', verificarJWT, controller.actualizarPaciente);
  pacientesRouter.delete('/:dni', verificarJWT, controller.eliminarPaciente);
  return pacientesRouter;
}