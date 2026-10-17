export class Cita {
  constructor(
    public readonly idCita: number, 
    public readonly dniPaciente: string, 
    public readonly idMedico: string, 
    public readonly idHorario: number, 
    public readonly estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA' = 'PENDIENTE',
    public readonly fechaCreacion?: Date
  ) {}
}