import { Request, Response } from 'express';
import { HorarioService } from '../application/HorarioService';
export declare class HorarioController {
    private readonly service;
    constructor(service: HorarioService);
    crear: (req: Request, res: Response) => Promise<void>;
    listar: (req: Request, res: Response) => Promise<void>;
    obtenerPorId: (req: Request, res: Response) => Promise<void>;
    actualizar: (req: Request, res: Response) => Promise<void>;
    eliminar: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=HorarioController.d.ts.map