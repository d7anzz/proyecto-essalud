"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consulta = void 0;
class Consulta {
    idConsulta;
    idCita;
    dniPaciente;
    idMedico;
    diagnostico;
    observaciones;
    fechaAtencion;
    constructor(idConsulta, idCita, dniPaciente, idMedico, diagnostico, observaciones, fechaAtencion) {
        this.idConsulta = idConsulta;
        this.idCita = idCita;
        this.dniPaciente = dniPaciente;
        this.idMedico = idMedico;
        this.diagnostico = diagnostico;
        this.observaciones = observaciones;
        this.fechaAtencion = fechaAtencion;
    }
}
exports.Consulta = Consulta;
//# sourceMappingURL=Consulta.js.map