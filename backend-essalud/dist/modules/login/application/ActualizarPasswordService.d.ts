import { LoginRepository } from '../domain/LoginRepository';
export interface ActualizarPasswordDTO {
    dni: string;
    nuevaPassword: string;
}
export declare class ActualizarPasswordInicialService {
    private readonly authRepository;
    constructor(authRepository: LoginRepository);
    ejecutar(data: ActualizarPasswordDTO): Promise<void>;
}
//# sourceMappingURL=ActualizarPasswordService.d.ts.map