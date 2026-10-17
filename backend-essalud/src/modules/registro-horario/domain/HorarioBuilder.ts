import { Horario } from './Horario';

export class HorarioBuilder {
  private id: number = 0;
  private dni: string = '';
  private fecha: string = '';
  private horaInicio: string = '';
  private horaFin: string = '';
  private turno: 'MAÑANA' | 'TARDE' | 'NOCHE' = 'MAÑANA';
  private estado: 'DISPONIBLE' | 'OCUPADO' | boolean = 'DISPONIBLE';

  conId(id: number): this { this.id = id; return this; }
  conDni(dni: string): this { this.dni = dni; return this; }
  conFecha(fecha: string): this { this.fecha = fecha; return this; }
  conHoraInicio(horaInicio: string): this { this.horaInicio = horaInicio; return this; }
  conHoraFin(horaFin: string): this { this.horaFin = horaFin; return this; }
  conTurno(turno: 'MAÑANA' | 'TARDE' | 'NOCHE'): this { this.turno = turno; return this; }

  conEstado(estado: 'DISPONIBLE' | 'OCUPADO' | boolean): this { 
    this.estado = estado; 
    return this; 
  }

  build(): Horario {
    return new Horario(
      this.id, 
      this.dni, 
      this.fecha, 
      this.horaInicio, 
      this.horaFin, 
      this.turno, 
      this.estado
    );
  }
}