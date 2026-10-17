"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarRutasConsulta = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../../../shared/middlewares/authMiddleware"); // Ajusta la ruta a tu middleware real
const configurarRutasConsulta = (controlador) => {
    const router = (0, express_1.Router)();
    // 🩺 Endpoint exclusivo protegido por JSON Web Tokens para el acto médico
    router.post('/', authMiddleware_1.verificarJWT, controlador.crear);
    return router;
};
exports.configurarRutasConsulta = configurarRutasConsulta;
//# sourceMappingURL=ConsultaRoutes.js.map