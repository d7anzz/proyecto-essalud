import { PersonalRepository } from '../domain/PersonalRepository';
export interface RegistrarPersonalDTO {
    dni: string;
    nombre: string;
    apellidos: string;
    username: string;
    idRol: number;
    colegiatura?: string | null;
    idEspecialidad?: number | null;
}
export declare class RegistrarPersonalService {
    private readonly personalRepository;
    private readonly ROLES_PERMITIDOS;
    constructor(personalRepository: PersonalRepository);
    ejecutar(dto: RegistrarPersonalDTO, rolEjecutor: number): Promise<void>;
}
//# sourceMappingURL=RegistrarPersonalService.d.ts.map