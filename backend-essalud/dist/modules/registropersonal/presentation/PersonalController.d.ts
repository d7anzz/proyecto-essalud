import { Request, Response } from 'express';
import { RegistrarPersonalService } from '../application/RegistrarPersonalService';
export declare class PersonalController {
    private readonly registrarPersonalService;
    constructor(registrarPersonalService: RegistrarPersonalService);
    registrar: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=PersonalController.d.ts.map