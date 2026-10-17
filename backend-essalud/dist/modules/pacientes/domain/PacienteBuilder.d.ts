import { Paciente } from './Paciente';
export declare class PacienteBuilder {
    private _dni;
    private _nombre;
    private _apellidos;
    private _fechaNacimiento;
    /** Asigna y valida el DNI (exactamente 8 dígitos numéricos). */
    setDni(dni: string): this;
    /** Asigna y valida el nombre (no vacío, sin espacios sueltos). */
    setNombre(nombre: string): this;
    /** Asigna y valida los apellidos. */
    setApellidos(apellidos: string): this;
    /**
     * Acepta string ISO ('1990-05-21') o Date.
     * Valida que la fecha sea real y no futura.
     */
    setFechaNacimiento(fecha: string | Date): this;
    /**
     * Paso final: verifica que todos los campos obligatorios
     * estén definidos y delega la creación a la entidad Paciente.
     */
    build(): Paciente;
}
//# sourceMappingURL=PacienteBuilder.d.ts.map