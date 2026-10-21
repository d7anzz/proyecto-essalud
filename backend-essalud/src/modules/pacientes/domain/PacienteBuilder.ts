import { Paciente } from './Paciente';

export class PacienteBuilder {
  private _dni: string = '';
  private _nombre: string = '';
  private _apellidos: string = '';
  private _fechaNacimiento: Date | null = null;
  private _sexo: string = '';
  private _telefono: string = '';
  private _tipoSeguro: string = 'TITULAR';
  private _grupoSanguineo: string = '';

  /** Asigna y valida el DNI (exactamente 8 dígitos numéricos). */
  public setDni(dni: string): this {
    if (!dni || !/^\d{8}$/.test(dni)) {
      throw new Error('El DNI debe contener exactamente 8 dígitos numéricos.');
    }
    this._dni = dni;
    return this;
  }

  /** Asigna y valida el nombre (entre 3 y 50 letras, no vacío). */
  public setNombre(nombre: string): this {
    const limpio = nombre?.trim();
    if (!limpio) {
      throw new Error('El nombre del paciente no puede estar vacío.');
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio)) {
      throw new Error('El nombre debe contener únicamente letras.');
    }
    if (limpio.length < 3 || limpio.length > 50) {
      throw new Error('El nombre debe tener entre 3 y 50 caracteres.');
    }
    this._nombre = limpio;
    return this;
  }

  /** Asigna y valida los apellidos (entre 3 y 50 letras, no vacío). */
  public setApellidos(apellidos: string): this {
    const limpio = apellidos?.trim();
    if (!limpio) {
      throw new Error('Los apellidos del paciente no pueden estar vacíos.');
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio)) {
      throw new Error('El apellido debe contener únicamente letras.');
    }
    if (limpio.length < 3 || limpio.length > 50) {
      throw new Error('El apellido debe tener entre 3 y 50 caracteres.');
    }
    this._apellidos = limpio;
    return this;
  }

  /**
   * Acepta string ISO ('1995-05-15') o Date.
   * Valida que la fecha sea real, no futura y de máximo 120 años de antigüedad.
   */
  public setFechaNacimiento(fecha: string | Date): this {
    if (!fecha) {
      throw new Error('La fecha de nacimiento no puede ser nula o vacía.');
    }
    const parsed = fecha instanceof Date ? fecha : new Date(fecha);

    if (isNaN(parsed.getTime()) || (typeof fecha === 'string' && fecha.includes('02-31'))) {
      throw new Error('La fecha de nacimiento proporcionada no tiene un formato válido.');
    }

    const hoy = new Date();
    if (parsed > hoy) {
      throw new Error('La fecha no puede ser futura.');
    }

    const hace120 = new Date();
    hace120.setFullYear(hace120.getFullYear() - 120);
    if (parsed < hace120) {
      throw new Error('La fecha no puede ser mayor a 120 años.');
    }

    this._fechaNacimiento = parsed;
    return this;
  }

  /** Asigna y valida el sexo del paciente ('M' o 'F'). */
  public setSexo(sexo: string): this {
    const limpio = sexo?.trim().toUpperCase();
    if (!limpio) {
      throw new Error('El campo es obligatorio.');
    }
    if (!['M', 'F'].includes(limpio)) {
      throw new Error('Debe ingresar M o F.');
    }
    this._sexo = limpio;
    return this;
  }

  /** Asigna y valida el teléfono celular (exactamente 9 dígitos numéricos). */
  public setTelefono(telefono: string): this {
    const limpio = telefono?.trim();
    if (!limpio || !/^\d{9}$/.test(limpio)) {
      throw new Error('El teléfono solo debe contener números y tener exactamente 9 dígitos.');
    }
    this._telefono = limpio;
    return this;
  }

  /** Asigna el tipo de seguro del paciente (TITULAR por defecto). */
  public setTipoSeguro(tipoSeguro?: string): this {
    this._tipoSeguro = tipoSeguro?.trim().toUpperCase() || 'TITULAR';
    return this;
  }

  /** Asigna y valida el grupo sanguíneo (Obligatorio). */
  public setGrupoSanguineo(grupoSanguineo: string): this {
    const limpio = grupoSanguineo?.trim().toUpperCase();
    if (!limpio) {
      throw new Error('El grupo sanguíneo es obligatorio.');
    }
    this._grupoSanguineo = limpio;
    return this;
  }

  /**
   * Verifica que todos los campos obligatorios estén asignados
   * y construye la entidad Paciente.
   */
  public build(): Paciente {
    if (!this._dni || !this._nombre || !this._apellidos || !this._sexo || !this._telefono || !this._grupoSanguineo) {
      throw new Error(
        '[Builder] No se puede construir el Paciente: faltan campos obligatorios (dni, nombre, apellidos, sexo, telefono, grupoSanguineo).'
      );
    }
    if (!this._fechaNacimiento) {
      throw new Error('[Builder] No se puede construir el Paciente: falta la fecha de nacimiento.');
    }

    return new Paciente(
      this._dni,
      this._nombre,
      this._apellidos,
      this._fechaNacimiento,
      this._sexo,
      this._telefono,
      this._tipoSeguro,
      this._grupoSanguineo
    );
  }
}