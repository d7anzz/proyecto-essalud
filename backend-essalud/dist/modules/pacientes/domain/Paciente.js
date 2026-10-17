"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paciente = void 0;
class Paciente {
    dni;
    nombre;
    apellidos;
    fechaNacimiento;
    constructor(dni, nombre, apellidos, fechaNacimiento) {
        this.dni = dni;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.fechaNacimiento = fechaNacimiento;
        if (this.fechaNacimiento > new Date()) {
            throw new Error("La fecha de nacimiento no puede ser una fecha futura.");
        }
        if (this.dni.length !== 8) {
            throw new Error("El DNI debe tener exactamente 8 dígitos.");
        }
    }
}
exports.Paciente = Paciente;
//# sourceMappingURL=Paciente.js.map