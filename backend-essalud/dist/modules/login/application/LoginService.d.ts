import { LoginDTO } from './LoginDTO';
import { LoginRepository } from '../domain/LoginRepository';
export declare class LoginService {
    private readonly authRepository;
    private readonly JWT_SECRET;
    constructor(authRepository: LoginRepository);
    ejecutar(data: LoginDTO): Promise<{
        token: string;
        dni: string;
        idRol: number;
        requiereCambio?: boolean;
    }>;
}
//# sourceMappingURL=LoginService.d.ts.map