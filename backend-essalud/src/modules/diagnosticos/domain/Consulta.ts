export class Consulta {
  constructor(
    public readonly idConsulta: number,
    public readonly idCita: number,
    public readonly dniPaciente: string,
    public readonly idMedico: string,
    public readonly diagnostico: string,
    public readonly observaciones: string,
    public readonly fechaAtencion?: Date
  ) {}
}