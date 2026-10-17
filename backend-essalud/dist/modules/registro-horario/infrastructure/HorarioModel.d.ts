import { PersonalModel } from '../../registropersonal/infrastructure/PersonalModel';
export declare class HorarioModel {
    id: number;
    dni: string;
    personal: PersonalModel;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    turno: 'MAÑANA' | 'TARDE' | 'NOCHE';
    estado: boolean;
}
//# sourceMappingURL=HorarioModel.d.ts.map