"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarRutasHorario = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../../shared/middlewares/authMiddleware");
const configurarRutasHorario = (controlador) => {
    const router = (0, express_1.Router)();
    router.get('/', authMiddleware_1.verificarJWT, controlador.listar);
    router.get('/:id', authMiddleware_1.verificarJWT, controlador.obtenerPorId);
    router.post('/', authMiddleware_1.verificarJWT, controlador.crear);
    router.put('/:id', authMiddleware_1.verificarJWT, controlador.actualizar);
    router.delete('/:id', authMiddleware_1.verificarJWT, controlador.eliminar);
    return router;
};
exports.configurarRutasHorario = configurarRutasHorario;
//# sourceMappingURL=HorarioRoutes.js.map