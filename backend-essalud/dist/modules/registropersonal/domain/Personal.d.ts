import { Prototype } from './Prototype';
export declare class Personal implements Prototype<Personal> {
    readonly dni: string;
    readonly nombre: string;
    readonly apellidos: string;
    readonly idRol: number;
    readonly colegiatura: string | null;
    readonly idEspecialidad: number | null;
    readonly nombreEspecialidad?: string | undefined;
    constructor(dni: string, nombre: string, apellidos: string, idRol: number, colegiatura?: string | null, idEspecialidad?: number | null, nombreEspecialidad?: string | undefined);
    private validarReglasDeNegocio;
    clone(): Personal;
}
//# sourceMappingURL=Personal.d.ts.map