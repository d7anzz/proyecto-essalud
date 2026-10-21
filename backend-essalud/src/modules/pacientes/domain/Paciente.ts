export class Paciente {
  constructor(
    public dni: string,
    public nombre: string,
    public apellidos: string,
    public fechaNacimiento: Date,
    public sexo: string,
    public telefono?: string,
    public tipoSeguro: string = 'TITULAR',
    public grupoSanguineo?: string
  ) {
    if (this.fechaNacimiento > new Date()) {
      throw new Error("La fecha de nacimiento no puede ser una fecha futura.");
    }
    if (this.dni.length !== 8) {
      throw new Error("El DNI debe tener exactamente 8 dígitos.");
    }
    if (!['M', 'F'].includes(this.sexo?.toUpperCase())) {
      throw new Error("El campo sexo debe ser 'M' (Masculino) o 'F' (Femenino).");
    }
  }
}