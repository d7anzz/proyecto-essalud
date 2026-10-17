import { Request, Response } from 'express';
import { ConsultaService } from '../application/ConsultaService';
export declare class ConsultaController {
    private readonly service;
    constructor(service: ConsultaService);
    crear: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=ConsultaController.d.ts.map