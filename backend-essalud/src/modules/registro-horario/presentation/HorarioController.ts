import { Request, Response } from 'express';
import { HorarioService } from '../application/HorarioService';

export class HorarioController {
  constructor(private readonly service: HorarioService) {}

  public crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioLogueado = (req as any).user;
      const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;

      if (!rolEjecutor) {
        res.status(401).json({ ok: false, mensaje: 'No autorizado: El rol del usuario no es válido o expiró.' });
        return;
      }

      const horario = await this.service.crear(req.body, Number(rolEjecutor));
      res.status(201).json({ ok: true, data: horario });
    } catch (e: any) {
      const esNegocio = e.message.includes('Conflicto de Agenda') || 
                        e.message.includes('Fuera de Rango') || 
                        e.message.includes('Error Lógico') ||
                        e.message.includes('Exceso de Capacidad') ||
                        e.message.includes('Validación');
                        
      const status = e.message.includes('Acceso denegado') ? 403 : esNegocio ? 400 : 500;
      
      res.status(status).json({ ok: false, mensaje: e.message });
    }
  };

  public listar = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioLogueado = (req as any).user;
      const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;
      const dniEjecutor = usuarioLogueado?.dni;

      if (!rolEjecutor || !dniEjecutor) {
        res.status(401).json({ ok: false, mensaje: 'No autorizado: Sesión inválida.' });
        return;
      }

      const horarios = await this.service.listar(Number(rolEjecutor), String(dniEjecutor));
      res.json({ ok: true, data: horarios });
    } catch (e: any) {
      res.status(500).json({ ok: false, mensaje: e.message });
    }
  };

  public obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params['id']);
      if (isNaN(id)) { res.status(400).json({ ok: false, mensaje: 'ID inválido.' }); return; }
      
      const horario = await this.service.obtenerPorId(id);
      if (!horario) { res.status(404).json({ ok: false, mensaje: 'No encontrado.' }); return; }
      
      res.json({ ok: true, data: horario });
    } catch (e: any) {
      res.status(500).json({ ok: false, mensaje: e.message });
    }
  };

  public actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params['id']);
      if (isNaN(id)) { res.status(400).json({ ok: false, mensaje: 'ID de horario inválido.' }); return; }

      const usuarioLogueado = (req as any).user;
      const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;

      if (!rolEjecutor) {
        res.status(401).json({ ok: false, mensaje: 'No autorizado: Permisos insuficientes.' });
        return;
      }

      const horario = await this.service.actualizar(id, req.body, Number(rolEjecutor));
      if (!horario) { res.status(404).json({ ok: false, mensaje: 'El horario solicitado no existe.' }); return; }

      res.json({ ok: true, data: horario });
    } catch (e: any) {
      const esNegocio = e.message.includes('Conflicto de Agenda') || 
                        e.message.includes('Fuera de Rango') || 
                        e.message.includes('Error Lógico') ||
                        e.message.includes('Exceso de Capacidad') ||
                        e.message.includes('Validación');
                        
      const status = e.message.includes('Acceso denegado') ? 403 : esNegocio ? 400 : 500;

      res.status(status).json({ ok: false, mensaje: e.message });
    }
  };

  public eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params['id']);
      if (isNaN(id)) { res.status(400).json({ ok: false, mensaje: 'ID de horario inválido.' }); return; }

      const usuarioLogueado = (req as any).user;
      const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;

      if (!rolEjecutor) {
        res.status(401).json({ ok: false, mensaje: 'No autorizado: Permisos insuficientes.' });
        return;
      }

      const eliminado = await this.service.eliminar(id, Number(rolEjecutor));
      if (!eliminado) { res.status(404).json({ ok: false, mensaje: 'El horario solicitado no existe.' }); return; }

      res.json({ ok: true, eliminado });
    } catch (e: any) {
      res.status(e.message.includes('Acceso denegado') ? 403 : 500).json({ ok: false, mensaje: e.message });
    }
  };
}