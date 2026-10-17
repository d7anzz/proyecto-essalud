import { Paciente } from './Paciente';

export class PacienteBuilder {

    // Campos internos en estado "vacío/inválido" hasta que se asignen
    private _dni: string           = '';
    private _nombre: string        = '';
    private _apellidos: string     = '';
    private _fechaNacimiento: Date | null = null; // 🔑 Cambiado a null para evitar colisiones con Date(0)

    /** Asigna y valida el DNI (exactamente 8 dígitos numéricos). */
    public setDni(dni: string): this {
        if (!dni || !/^\d{8}$/.test(dni)) {
            throw new Error('[Builder] El DNI debe contener exactamente 8 dígitos numéricos.');
        }
        this._dni = dni;
        return this; // retorna "this" para encadenar llamadas
    }

    /** Asigna y valida el nombre (no vacío, sin espacios sueltos). */
    public setNombre(nombre: string): this {
        const limpio = nombre?.trim();
        if (!limpio) {
            throw new Error('[Builder] El nombre del paciente no puede estar vacío.');
        }
        this._nombre = limpio;
        return this;
    }

    /** Asigna y valida los apellidos. */
    public setApellidos(apellidos: string): this {
        const limpio = apellidos?.trim();
        if (!limpio) {
            throw new Error('[Builder] Los apellidos del paciente no pueden estar vacíos.');
        }
        this._apellidos = limpio;
        return this;
    }

    /**
     * Acepta string ISO ('1990-05-21') o Date.
     * Valida que la fecha sea real y no futura.
     */
    public setFechaNacimiento(fecha: string | Date): this {
        if (!fecha) {
            throw new Error('[Builder] La fecha de nacimiento no puede ser nula o vacía.');
        }
        
        const parsed = fecha instanceof Date ? fecha : new Date(fecha);
        if (isNaN(parsed.getTime())) {
            throw new Error('[Builder] La fecha de nacimiento proporcionada no tiene un formato válido.');
        }
        if (parsed > new Date()) {
            throw new Error('[Builder] La fecha de nacimiento no puede ser una fecha futura.');
        }
        this._fechaNacimiento = parsed;
        return this;
    }

    /**
     * Paso final: verifica que todos los campos obligatorios
     * estén definidos y delega la creación a la entidad Paciente.
     */
    public build(): Paciente {
        if (!this._dni || !this._nombre || !this._apellidos) {
            throw new Error(
                '[Builder] No se puede construir el Paciente: faltan campos obligatorios (dni, nombre, apellidos).'
            );
        }
        if (!this._fechaNacimiento) {
            throw new Error('[Builder] No se puede construir el Paciente: falta la fecha de nacimiento.');
        }
        
        return new Paciente(
            this._dni,
            this._nombre,
            this._apellidos,
            this._fechaNacimiento
        );
    }
}