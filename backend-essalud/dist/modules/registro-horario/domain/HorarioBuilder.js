"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioBuilder = void 0;
const Horario_1 = require("./Horario");
class HorarioBuilder {
    id = 0;
    dni = '';
    fecha = '';
    horaInicio = '';
    horaFin = '';
    turno = 'MAÑANA';
    estado = 'DISPONIBLE';
    conId(id) { this.id = id; return this; }
    conDni(dni) { this.dni = dni; return this; }
    conFecha(fecha) { this.fecha = fecha; return this; }
    conHoraInicio(horaInicio) { this.horaInicio = horaInicio; return this; }
    conHoraFin(horaFin) { this.horaFin = horaFin; return this; }
    conTurno(turno) { this.turno = turno; return this; }
    conEstado(estado) {
        this.estado = estado;
        return this;
    }
    build() {
        return new Horario_1.Horario(this.id, this.dni, this.fecha, this.horaInicio, this.horaFin, this.turno, this.estado);
    }
}
exports.HorarioBuilder = HorarioBuilder;
//# sourceMappingURL=HorarioBuilder.js.map