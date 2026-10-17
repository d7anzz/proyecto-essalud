export class Paciente {
  constructor(
    public dni: string,
    public nombre: string,
    public apellidos: string,
    public fechaNacimiento: Date
  ) {
    if (this.fechaNacimiento > new Date()) {
      throw new Error("La fecha de nacimiento no puede ser una fecha futura.");
    }
    if (this.dni.length !== 8) {
      throw new Error("El DNI debe tener exactamente 8 dígitos.");
    }
  }
}