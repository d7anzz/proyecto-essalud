import { Request, Response } from 'express';
import { FarmaciaService } from '../application/FarmaciaService';

export class FarmaciaController {
  constructor(private readonly service: FarmaciaService) {}

  listarInventario = async (req: Request, res: Response): Promise<void> => {
    try {
      const rol = (req as any).user?.id_rol ?? (req as any).user?.idRol;
      const data = await this.service.obtenerInventario(Number(rol));
      res.json({ ok: true, data });
    } catch (e: any) {
      this.enviarError(res, e);
    }
  };

  agregarMedicamento = async (req: Request, res: Response): Promise<void> => {
    try {
      const rol = (req as any).user?.id_rol ?? (req as any).user?.idRol;
      const data = await this.service.registrarMedicamento(req.body, Number(rol));
      res.status(201).json({ ok: true, data, mensaje: 'Medicamento ingresado al inventario con éxito.' });
    } catch (e: any) {
      this.enviarError(res, e);
    }
  };

  listarRecetas = async (req: Request, res: Response): Promise<void> => {
    try {
      const rol = (req as any).user?.id_rol ?? (req as any).user?.idRol;
      const dni = req.query.dniPaciente as string;
      const data = await this.service.obtenerRecetasPendientes(Number(rol), dni);
      res.json({ ok: true, data });
    } catch (e: any) {
      this.enviarError(res, e);
    }
  };

  entregarReceta = async (req: Request, res: Response): Promise<void> => {
    try {
      const rol = (req as any).user?.id_rol ?? (req as any).user?.idRol;
      await this.service.despacharReceta(req.body, Number(rol));
      res.json({ ok: true, mensaje: 'Receta procesada. Stock actualizado e insumos entregados.' });
    } catch (e: any) {
      this.enviarError(res, e);
    }
  };

  private enviarError(res: Response, e: any): void {
    const status = e.message.includes('Acceso denegado') ? 403 : 400;
    res.status(status).json({ ok: false, mensaje: e.message });
  }
}