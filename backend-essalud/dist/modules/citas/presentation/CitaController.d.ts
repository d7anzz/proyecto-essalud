import { Request, Response } from 'express';
import { CitaService } from '../application/CitaService';
export declare class CitaController {
    private readonly service;
    constructor(service: CitaService);
    crear: (req: Request, res: Response) => Promise<void>;
    listar: (req: Request, res: Response) => Promise<void>;
    obtenerPorId: (req: Request, res: Response) => Promise<void>;
    actualizar: (req: Request, res: Response) => Promise<void>;
    eliminar: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=CitaController.d.ts.map