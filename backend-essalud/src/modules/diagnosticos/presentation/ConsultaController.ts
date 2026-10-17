import { Request, Response } from 'express';
import { ConsultaService } from '../application/ConsultaService';

export class ConsultaController {
  constructor(private readonly service: ConsultaService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    try {
      // 🛡️ Jalamos el usuario inyectado de forma segura por el middleware de JWT
      const usuarioLogueado = (req as any).user;
      
      // Soportamos cualquier convención de nombres que tenga tu payload de token (id_rol o idRol)
      const rolEjecutor = usuarioLogueado?.id_rol ?? usuarioLogueado?.idRol;

      if (!rolEjecutor) {
        res.status(401).json({ 
          ok: false, 
          mensaje: 'No autorizado: Sesión inválida o falta información de rol.' 
        });
        return;
      }

      // Invocamos al servicio de aplicación pasándole el req.body y el rol verificado
      await this.service.crearConsultaMedica(req.body, Number(rolEjecutor));

      res.status(201).json({ 
        ok: true, 
        mensaje: '📋 Acto médico registrado con éxito. La cita administrativa ha sido COMPLETADA.' 
      });
    } catch (e: any) {
      // Si el error es por permisos de rol respondemos 403 (Forbidden), si no un 400 (Bad Request)
      const status = e.message.includes('Acceso denegado') ? 403 : 400;
      res.status(status).json({ 
        ok: false, 
        mensaje: e.message 
      });
    }
  };
}