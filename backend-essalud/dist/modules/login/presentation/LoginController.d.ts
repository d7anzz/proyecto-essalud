import { Request, Response } from 'express';
import { LoginService } from '../application/LoginService';
export declare class LoginController {
    private readonly loginService;
    constructor(loginService: LoginService);
    login: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=LoginController.d.ts.map