import { Prototype } from './Prototype';

export class Personal implements Prototype<Personal> {
  constructor(
    public readonly dni: string,
    public readonly nombre: string,
    public readonly apellidos: string,
    public readonly idRol: number,
    public readonly colegiatura: string | null = null,
    public readonly idEspecialidad: number | null = null,
    public readonly nombreEspecialidad?: string,
    public readonly telefono: string | null = null,
    public readonly fecNac: Date | string | null = null
  ) {
    this.validarReglasDeNegocio();
  }

  private validarReglasDeNegocio(): void {
    // 1. VALIDACIÓN DE DNI
    if (!this.dni || this.dni.length !== 8) {
      throw new Error('El DNI del personal debe tener exactamente 8 dígitos.');
    }
    if (!/^\d{8}$/.test(this.dni)) {
      throw new Error('El DNI debe contener únicamente números');
    }

    // 2. VALIDACIÓN DE NOMBRE
    if (!this.nombre || !this.nombre.trim()) {
      throw new Error('El nombre y los apellidos son campos obligatorios para el registro.');
    }
    if (this.nombre.length < 3 || this.nombre.length > 50) {
      throw new Error('El nombre debe tener entre 3 y 50 caracteres');
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.nombre)) {
      throw new Error('El nombre debe contener únicamente letras');
    }

    // 3. VALIDACIÓN DE APELLIDO
    if (!this.apellidos || !this.apellidos.trim()) {
      throw new Error('El nombre y los apellidos son campos obligatorios para el registro.');
    }
    if (this.apellidos.length < 3 || this.apellidos.length > 50) {
      throw new Error('El apellido debe tener entre 3 y 50 caracteres');
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.apellidos)) {
      throw new Error('El apellido debe contener únicamente letras');
    }

    // 4. VALIDACIÓN DE FECHA DE NACIMIENTO
    if (this.fecNac) {
      let fechaObj: Date;

      if (typeof this.fecNac === 'string') {
        const partes = this.fecNac.split('-');
        if (partes.length === 3) {
          const anio = Number(partes[0]);
          const mes = Number(partes[1]) - 1;
          const dia = Number(partes[2]);
          fechaObj = new Date(anio, mes, dia);

          if (
            fechaObj.getFullYear() !== anio ||
            fechaObj.getMonth() !== mes ||
            fechaObj.getDate() !== dia
          ) {
            throw new Error('Fecha inválida');
          }
        } else {
          fechaObj = new Date(this.fecNac);
        }
      } else {
        fechaObj = this.fecNac;
      }

      if (isNaN(fechaObj.getTime())) {
        throw new Error('Fecha inválida');
      }

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaObj > hoy) {
        throw new Error('La fecha no puede ser futura');
      }

      const limite80Anos = new Date();
      limite80Anos.setFullYear(limite80Anos.getFullYear() - 80);
      limite80Anos.setHours(0, 0, 0, 0);

      if (fechaObj < limite80Anos) {
        throw new Error('La fecha no puede ser mayor a 80 años');
      }
    }

    // 5. VALIDACIÓN DE ROL Y ESPECIALIDAD
    if (this.idRol === 1) { // Médico
      if (!this.colegiatura || this.colegiatura.trim() === '') {
        throw new Error('El personal con rol de Médico debe registrar obligatoriamente su número de colegiatura (CMP).');
      }
      if (!this.idEspecialidad || this.idEspecialidad < 1 || this.idEspecialidad > 5) {
        throw new Error('Especialidad inválida');
      }
      // Evaluación de formato ANTES de longitud para coincidir con la intención de la regla
      if (!/^\d+$/.test(this.colegiatura)) {
        throw new Error('La colegiatura debe tener únicamente dígitos');
      }
      if (this.colegiatura.length < 5 || this.colegiatura.length > 6) {
        throw new Error('La colegiatura debe tener entre 5 y 6 dígitos');
      }
    }

    // 6. VALIDACIÓN DE TELÉFONO
    if (this.telefono) {
      if (!/^\d{9}$/.test(this.telefono)) {
        throw new Error('El número de teléfono debe tener 9 dígitos');
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
      this.nombreEspecialidad,
      this.telefono,
      this.fecNac
    );
  }
}