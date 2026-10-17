import { Horario } from './Horario';
export declare class HorarioBuilder {
    private id;
    private dni;
    private fecha;
    private horaInicio;
    private horaFin;
    private turno;
    private estado;
    conId(id: number): this;
    conDni(dni: string): this;
    conFecha(fecha: string): this;
    conHoraInicio(horaInicio: string): this;
    conHoraFin(horaFin: string): this;
    conTurno(turno: 'MAÑANA' | 'TARDE' | 'NOCHE'): this;
    conEstado(estado: 'DISPONIBLE' | 'OCUPADO' | boolean): this;
    build(): Horario;
}
//# sourceMappingURL=HorarioBuilder.d.ts.map