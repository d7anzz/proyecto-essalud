import { Request, Response } from 'express';
import { FarmaciaService } from '../application/FarmaciaService';
export declare class FarmaciaController {
    private readonly service;
    constructor(service: FarmaciaService);
    listarInventario: (req: Request, res: Response) => Promise<void>;
    agregarMedicamento: (req: Request, res: Response) => Promise<void>;
    listarRecetas: (req: Request, res: Response) => Promise<void>;
    entregarReceta: (req: Request, res: Response) => Promise<void>;
    private enviarError;
}
//# sourceMappingURL=FarmaciaController.d.ts.map