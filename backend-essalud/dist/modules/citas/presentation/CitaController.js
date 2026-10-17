"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitaController = void 0;
class CitaController {
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
            const cita = await this.service.crear(req.body, Number(rolEjecutor));
            res.status(201).json({ ok: true, data: cita });
        }
        catch (e) {
            const status = e.message.includes('Acceso denegado') ? 403 : 400;
            res.status(status).json({ ok: false, mensaje: e.message });
        }
    };
    listar = async (req, res) => {
        try {
            const usuarioLogueado = req.user;
            const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;
            const dniUsuarioLogueado = usuarioLogueado?.dni;
            if (!rolEjecutor || !dniUsuarioLogueado) {
                res.status(401).json({ ok: false, mensaje: 'No autorizado: Sesión inválida.' });
                return;
            }
            const data = await this.service.listar(Number(rolEjecutor), String(dniUsuarioLogueado));
            res.json({ ok: true, data });
        }
        catch (e) {
            res.status(500).json({ ok: false, mensaje: e.message });
        }
    };
    obtenerPorId = async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ ok: false, mensaje: 'ID inválido' });
                return;
            }
            const usuarioLogueado = req.user;
            const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;
            const dniUsuarioLogueado = usuarioLogueado?.dni;
            if (!rolEjecutor || !dniUsuarioLogueado) {
                res.status(401).json({ ok: false, mensaje: 'No autorizado: Sesión inválida.' });
                return;
            }
            const data = await this.service.obtenerPorId(id, Number(rolEjecutor), String(dniUsuarioLogueado));
            if (!data) {
                res.status(404).json({ ok: false, mensaje: 'No encontrado' });
                return;
            }
            res.json({ ok: true, data });
        }
        catch (e) {
            const status = e.message.includes('Acceso denegado') ? 403 : 400;
            res.status(status).json({ ok: false, mensaje: e.message });
        }
    };
    actualizar = async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ ok: false, mensaje: 'ID inválido' });
                return;
            }
            const usuarioLogueado = req.user;
            const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;
            if (!rolEjecutor) {
                res.status(401).json({ ok: false, mensaje: 'No autorizado: Permisos insuficientes.' });
                return;
            }
            const data = await this.service.actualizar(id, req.body, Number(rolEjecutor));
            res.json({ ok: true, data });
        }
        catch (e) {
            res.status(400).json({ ok: false, mensaje: e.message });
        }
    };
    eliminar = async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ ok: false, mensaje: 'ID inválido' });
                return;
            }
            const usuarioLogueado = req.user;
            const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;
            if (!rolEjecutor) {
                res.status(401).json({ ok: false, mensaje: 'No autorizado: Permisos insuficientes.' });
                return;
            }
            const eliminado = await this.service.eliminar(id, Number(rolEjecutor));
            res.json({ ok: eliminado });
        }
        catch (e) {
            const status = e.message.includes('Acceso denegado') ? 403 : 400;
            res.status(status).json({ ok: false, mensaje: e.message });
        }
    };
}
exports.CitaController = CitaController;
//# sourceMappingURL=CitaController.js.map