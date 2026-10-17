"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioController = void 0;
class HorarioController {
    service;
    constructor(service) {
        this.service = service;
    }
    crear = async (req, res) => {
        try {
            const usuarioLogueado = req.user;
            const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;
            if (!rolEjecutor) {
                res.status(401).json({ ok: false, mensaje: 'No autorizado: El rol del usuario no es válido o expiró.' });
                return;
            }
            const horario = await this.service.crear(req.body, Number(rolEjecutor));
            res.status(201).json({ ok: true, data: horario });
        }
        catch (e) {
            const esNegocio = e.message.includes('Conflicto de Agenda') ||
                e.message.includes('Fuera de Rango') ||
                e.message.includes('Error Lógico') ||
                e.message.includes('Exceso de Capacidad') ||
                e.message.includes('Validación');
            const status = e.message.includes('Acceso denegado') ? 403 : esNegocio ? 400 : 500;
            res.status(status).json({ ok: false, mensaje: e.message });
        }
    };
    listar = async (req, res) => {
        try {
            const usuarioLogueado = req.user;
            const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;
            const dniEjecutor = usuarioLogueado?.dni;
            if (!rolEjecutor || !dniEjecutor) {
                res.status(401).json({ ok: false, mensaje: 'No autorizado: Sesión inválida.' });
                return;
            }
            const horarios = await this.service.listar(Number(rolEjecutor), String(dniEjecutor));
            res.json({ ok: true, data: horarios });
        }
        catch (e) {
            res.status(500).json({ ok: false, mensaje: e.message });
        }
    };
    obtenerPorId = async (req, res) => {
        try {
            const id = Number(req.params['id']);
            if (isNaN(id)) {
                res.status(400).json({ ok: false, mensaje: 'ID inválido.' });
                return;
            }
            const horario = await this.service.obtenerPorId(id);
            if (!horario) {
                res.status(404).json({ ok: false, mensaje: 'No encontrado.' });
                return;
            }
            res.json({ ok: true, data: horario });
        }
        catch (e) {
            res.status(500).json({ ok: false, mensaje: e.message });
        }
    };
    actualizar = async (req, res) => {
        try {
            const id = Number(req.params['id']);
            if (isNaN(id)) {
                res.status(400).json({ ok: false, mensaje: 'ID de horario inválido.' });
                return;
            }
            const usuarioLogueado = req.user;
            const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;
            if (!rolEjecutor) {
                res.status(401).json({ ok: false, mensaje: 'No autorizado: Permisos insuficientes.' });
                return;
            }
            const horario = await this.service.actualizar(id, req.body, Number(rolEjecutor));
            if (!horario) {
                res.status(404).json({ ok: false, mensaje: 'El horario solicitado no existe.' });
                return;
            }
            res.json({ ok: true, data: horario });
        }
        catch (e) {
            const esNegocio = e.message.includes('Conflicto de Agenda') ||
                e.message.includes('Fuera de Rango') ||
                e.message.includes('Error Lógico') ||
                e.message.includes('Exceso de Capacidad') ||
                e.message.includes('Validación');
            const status = e.message.includes('Acceso denegado') ? 403 : esNegocio ? 400 : 500;
            res.status(status).json({ ok: false, mensaje: e.message });
        }
    };
    eliminar = async (req, res) => {
        try {
            const id = Number(req.params['id']);
            if (isNaN(id)) {
                res.status(400).json({ ok: false, mensaje: 'ID de horario inválido.' });
                return;
            }
            const usuarioLogueado = req.user;
            const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;
            if (!rolEjecutor) {
                res.status(401).json({ ok: false, mensaje: 'No autorizado: Permisos insuficientes.' });
                return;
            }
            const eliminado = await this.service.eliminar(id, Number(rolEjecutor));
            if (!eliminado) {
                res.status(404).json({ ok: false, mensaje: 'El horario solicitado no existe.' });
                return;
            }
            res.json({ ok: true, eliminado });
        }
        catch (e) {
            res.status(e.message.includes('Acceso denegado') ? 403 : 500).json({ ok: false, mensaje: e.message });
        }
    };
}
exports.HorarioController = HorarioController;
//# sourceMappingURL=HorarioController.js.map