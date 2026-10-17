import { Prototype } from './Prototype';

export class Personal implements Prototype<Personal> {
  constructor(
    public readonly dni: string,
    public readonly nombre: string,
    public readonly apellidos: string,
    public readonly idRol: number,
    public readonly colegiatura: string | null = null,
    public readonly idEspecialidad: number | null = null,
    public readonly nombreEspecialidad?: string
  ) {
    this.validarReglasDeNegocio();
  }

  private validarReglasDeNegocio(): void {
    if (!this.dni || this.dni.length !== 8) {
      throw new Error('El DNI del personal debe tener exactamente 8 dígitos.');
    }
    if (!this.nombre.trim() || !this.apellidos.trim()) {
      throw new Error('El nombre y los apellidos son campos obligatorios para el registro.');
    }
    if (this.idRol === 1) {
      if (!this.colegiatura || this.colegiatura.trim() === '') {
        throw new Error('El personal con rol de Médico debe registrar obligatoriamente su número de colegiatura (CMP).');
      }
      if (!this.idEspecialidad) {
        throw new Error('El médico debe tener una especialidad asignada en el sistema.');
      }
    }
  }

  clone(): Personal {
    return new Personal(
      this.dni,
      this.nombre,
      this.apellidos,
      this.idRol,
      this.colegiatura,
      this.idEspecialidad,
      this.nombreEspecialidad
    );
  }
}