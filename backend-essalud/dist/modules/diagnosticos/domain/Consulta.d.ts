export declare class Consulta {
    readonly idConsulta: number;
    readonly idCita: number;
    readonly dniPaciente: string;
    readonly idMedico: string;
    readonly diagnostico: string;
    readonly observaciones: string;
    readonly fechaAtencion?: Date | undefined;
    constructor(idConsulta: number, idCita: number, dniPaciente: string, idMedico: string, diagnostico: string, observaciones: string, fechaAtencion?: Date | undefined);
}
//# sourceMappingURL=Consulta.d.ts.map