import { Request, Response } from 'express';
import { HistoriasService } from '../application/HistoriasService';
export declare class HistoriasController {
    private readonly historiasService;
    constructor(historiasService: HistoriasService);
    obtenerHistoriaPorDni(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=HistoriasController.d.ts.map