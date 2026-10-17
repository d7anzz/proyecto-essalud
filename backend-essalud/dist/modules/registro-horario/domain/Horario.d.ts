export declare class Horario {
    readonly id: number;
    readonly dni: string;
    readonly fecha: string;
    readonly horaInicio: string;
    readonly horaFin: string;
    readonly turno: 'MAÑANA' | 'TARDE' | 'NOCHE';
    readonly estado: 'DISPONIBLE' | 'OCUPADO' | boolean;
    constructor(id: number, dni: string, fecha: string, horaInicio: string, horaFin: string, turno: 'MAÑANA' | 'TARDE' | 'NOCHE', estado?: 'DISPONIBLE' | 'OCUPADO' | boolean);
}
//# sourceMappingURL=Horario.d.ts.map