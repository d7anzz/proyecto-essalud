"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Horario = void 0;
class Horario {
    id;
    dni;
    fecha;
    horaInicio;
    horaFin;
    turno;
    estado;
    constructor(id, dni, fecha, horaInicio, horaFin, turno, estado = 'DISPONIBLE') {
        this.id = id;
        this.dni = dni;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.turno = turno;
        this.estado = estado;
    }
}
exports.Horario = Horario;
//# sourceMappingURL=Horario.js.map