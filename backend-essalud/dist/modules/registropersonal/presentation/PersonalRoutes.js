"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarRutasPersonal = configurarRutasPersonal;
const express_1 = require("express");
function configurarRutasPersonal(controller) {
    const personalRouter = (0, express_1.Router)();
    // Ruta principal usada por el frontend:
    // POST /api/personal
    personalRouter.post('/', (req, res) => controller.registrar(req, res));
    // Ruta alternativa antigua:
    // POST /api/personal/registrar
    personalRouter.post('/registrar', (req, res) => controller.registrar(req, res));
    return personalRouter;
}
//# sourceMappingURL=PersonalRoutes.js.map