import { Request, Response } from 'express';
import { ActualizarPasswordInicialService } from '../application/ActualizarPasswordService';
import { CambiarPasswordPerfilService } from '../application/CambiarPasswordPerfilService';
export declare class ActualizarPasswordController {
    private readonly actualizarService;
    private readonly cambiarPerfilService;
    constructor(actualizarService: ActualizarPasswordInicialService, cambiarPerfilService: CambiarPasswordPerfilService);
    manejar: (req: Request, res: Response) => Promise<void>;
    manejarCambioPerfil: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=ActualizarPasswordController.d.ts.map