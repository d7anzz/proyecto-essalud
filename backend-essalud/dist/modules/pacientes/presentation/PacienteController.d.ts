import { Request, Response } from 'express';
import { PacienteService } from '../application/PacienteService';
export declare class PacientesController {
    private pacienteService;
    constructor(pacienteService: PacienteService);
    crearPaciente: (req: Request, res: Response) => Promise<void>;
    listarPacientes: (req: Request, res: Response) => Promise<void>;
    buscarPorDni: (req: Request, res: Response) => Promise<void>;
    actualizarPaciente: (req: Request, res: Response) => Promise<void>;
    eliminarPaciente: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=PacienteController.d.ts.map