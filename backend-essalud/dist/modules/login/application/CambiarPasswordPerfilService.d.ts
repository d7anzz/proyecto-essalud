import { LoginRepository } from '../domain/LoginRepository';
export declare class CambiarPasswordPerfilService {
    private readonly authRepository;
    constructor(authRepository: LoginRepository);
    ejecutar(dto: {
        dni: string;
        passwordActual: string;
        passwordNueva: string;
    }): Promise<void>;
}
//# sourceMappingURL=CambiarPasswordPerfilService.d.ts.map