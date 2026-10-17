"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurarRutasHistorias = void 0;
const express_1 = require("express");
const MysqlHistoriasRepository_1 = require("../infrastructure/MysqlHistoriasRepository");
const HistoriasService_1 = require("../application/HistoriasService");
const HistoriasController_1 = require("./HistoriasController");
const configurarRutasHistorias = (dataSource) => {
    const router = (0, express_1.Router)();
    const historiasRepository = new MysqlHistoriasRepository_1.MysqlHistoriasRepository(dataSource);
    const historiasService = new HistoriasService_1.HistoriasService(historiasRepository);
    const historiasController = new HistoriasController_1.HistoriasController(historiasService);
    router.get('/:dniPaciente', (req, res) => {
        historiasController.obtenerHistoriaPorDni(req, res);
    });
    return router;
};
exports.configurarRutasHistorias = configurarRutasHistorias;
//# sourceMappingURL=HistoriasRoutes.js.map