"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarRutasPacientes = configurarRutasPacientes;
const express_1 = require("express");
const authMiddleware_1 = require("../../../shared/middlewares/authMiddleware");
const pacientesRouter = (0, express_1.Router)();
function configurarRutasPacientes(controller) {
    pacientesRouter.post('/', authMiddleware_1.verificarJWT, controller.crearPaciente);
    pacientesRouter.get('/', authMiddleware_1.verificarJWT, controller.listarPacientes);
    pacientesRouter.get('/buscar/:dni', authMiddleware_1.verificarJWT, controller.buscarPorDni);
    pacientesRouter.put('/:dni', authMiddleware_1.verificarJWT, controller.actualizarPaciente);
    pacientesRouter.delete('/:dni', authMiddleware_1.verificarJWT, controller.eliminarPaciente);
    return pacientesRouter;
}
//# sourceMappingURL=PacienteRoutes.js.map