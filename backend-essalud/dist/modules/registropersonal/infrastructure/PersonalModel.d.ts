import { UsuarioModel } from '../../login/infrastructure/UsuarioModel';
export declare class EspecialidadInline {
    id: number;
    nombre: string;
}
export declare class PersonalModel {
    dni: string;
    nombre: string;
    apellidos: string;
    colegiatura: string | null;
    idEspecialidad: number | null;
    usuario: UsuarioModel;
    especialidad: EspecialidadInline;
}
//# sourceMappingURL=PersonalModel.d.ts.map