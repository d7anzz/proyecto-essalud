"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarRutasFarmacia = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../../shared/middlewares/authMiddleware");
const configurarRutasFarmacia = (controlador) => {
    const router = (0, express_1.Router)();
    router.get('/inventario', authMiddleware_1.verificarJWT, controlador.listarInventario);
    router.post('/inventario', authMiddleware_1.verificarJWT, controlador.agregarMedicamento);
    router.get('/recetas', authMiddleware_1.verificarJWT, controlador.listarRecetas);
    router.put('/despachar', authMiddleware_1.verificarJWT, controlador.entregarReceta);
    return router;
};
exports.configurarRutasFarmacia = configurarRutasFarmacia;
//# sourceMappingURL=FarmaciaRoutes.js.map