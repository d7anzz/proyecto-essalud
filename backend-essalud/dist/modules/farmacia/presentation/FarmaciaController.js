"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmaciaController = void 0;
class FarmaciaController {
    service;
    constructor(service) {
        this.service = service;
    }
    listarInventario = async (req, res) => {
        try {
            const rol = req.user?.id_rol ?? req.user?.idRol;
            const data = await this.service.obtenerInventario(Number(rol));
            res.json({ ok: true, data });
        }
        catch (e) {
            this.enviarError(res, e);
        }
    };
    agregarMedicamento = async (req, res) => {
        try {
            const rol = req.user?.id_rol ?? req.user?.idRol;
            const data = await this.service.registrarMedicamento(req.body, Number(rol));
            res.status(201).json({ ok: true, data, mensaje: 'Medicamento ingresado al inventario con éxito.' });
        }
        catch (e) {
            this.enviarError(res, e);
        }
    };
    listarRecetas = async (req, res) => {
        try {
            const rol = req.user?.id_rol ?? req.user?.idRol;
            const dni = req.query.dniPaciente;
            const data = await this.service.obtenerRecetasPendientes(Number(rol), dni);
            res.json({ ok: true, data });
        }
        catch (e) {
            this.enviarError(res, e);
        }
    };
    entregarReceta = async (req, res) => {
        try {
            const rol = req.user?.id_rol ?? req.user?.idRol;
            await this.service.despacharReceta(req.body, Number(rol));
            res.json({ ok: true, mensaje: 'Receta procesada. Stock actualizado e insumos entregados.' });
        }
        catch (e) {
            this.enviarError(res, e);
        }
    };
    enviarError(res, e) {
        const status = e.message.includes('Acceso denegado') ? 403 : 400;
        res.status(status).json({ ok: false, mensaje: e.message });
    }
}
exports.FarmaciaController = FarmaciaController;
//# sourceMappingURL=FarmaciaController.js.map