export class Consulta {
  constructor(
    public readonly idConsulta: number,
    public readonly idCita: number,
    public readonly dniPaciente: string,
    public readonly idMedico: string,
    public readonly diagnostico: string,
    public readonly observaciones: string,
    public readonly fechaAtencion?: Date
  ) {
    const diagLimpio = diagnostico ? diagnostico.trim() : '';
    if (diagLimpio.length < 5 || diagLimpio.length > 1000) {
      throw new Error('El diagnóstico debe tener entre 5 y 1000 caracteres');
    }
  }
}