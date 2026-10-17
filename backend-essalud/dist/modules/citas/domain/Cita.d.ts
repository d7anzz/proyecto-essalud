export declare class Cita {
    readonly idCita: number;
    readonly dniPaciente: string;
    readonly idMedico: string;
    readonly idHorario: number;
    readonly estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
    readonly fechaCreacion?: Date | undefined;
    constructor(idCita: number, dniPaciente: string, idMedico: string, idHorario: number, estado?: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA', fechaCreacion?: Date | undefined);
}
//# sourceMappingURL=Cita.d.ts.map