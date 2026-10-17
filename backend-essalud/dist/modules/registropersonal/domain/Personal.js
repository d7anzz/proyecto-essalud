"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personal = void 0;
class Personal {
    dni;
    nombre;
    apellidos;
    idRol;
    colegiatura;
    idEspecialidad;
    nombreEspecialidad;
    constructor(dni, nombre, apellidos, idRol, colegiatura = null, idEspecialidad = null, nombreEspecialidad) {
        this.dni = dni;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.idRol = idRol;
        this.colegiatura = colegiatura;
        this.idEspecialidad = idEspecialidad;
        this.nombreEspecialidad = nombreEspecialidad;
        this.validarReglasDeNegocio();
    }
    validarReglasDeNegocio() {
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
    clone() {
        return new Personal(this.dni, this.nombre, this.apellidos, this.idRol, this.colegiatura, this.idEspecialidad, this.nombreEspecialidad);
    }
}
exports.Personal = Personal;
//# sourceMappingURL=Personal.js.map