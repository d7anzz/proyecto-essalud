"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cita = void 0;
class Cita {
    idCita;
    dniPaciente;
    idMedico;
    idHorario;
    estado;
    fechaCreacion;
    constructor(idCita, dniPaciente, idMedico, idHorario, estado = 'PENDIENTE', fechaCreacion) {
        this.idCita = idCita;
        this.dniPaciente = dniPaciente;
        this.idMedico = idMedico;
        this.idHorario = idHorario;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
    }
}
exports.Cita = Cita;
//# sourceMappingURL=Cita.js.map