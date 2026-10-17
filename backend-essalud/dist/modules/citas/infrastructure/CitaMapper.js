"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitaMapper = void 0;
const Cita_1 = require("../domain/Cita");
class CitaMapper {
    static toDomain(m) {
        const cita = new Cita_1.Cita(m.idCita, m.dniPaciente, m.idMedico, m.idHorario, m.estado, m.fechaCreacion);
        if (m.paciente) {
            cita.nombrePaciente = `${m.paciente.nombre} ${m.paciente.apellidos}`;
        }
        if (m.horario) {
            cita.infoHorario = {
                fecha: m.horario.fecha,
                horaInicio: m.horario.horaInicio,
                turno: m.horario.turno
            };
            if (m.horario.personal) {
                const personalAsAny = m.horario.personal;
                cita.nombreMedico = `${m.horario.personal.nombre} ${m.horario.personal.apellidos}`;
                cita.personal = {
                    nombre: m.horario.personal.nombre,
                    apellidos: m.horario.personal.apellidos,
                    especialidad: personalAsAny.especialidad?.nombre || 'General'
                };
            }
            else {
                cita.nombreMedico = `Médico DNI: ${m.idMedico}`;
            }
        }
        return cita;
    }
    static toPersistence(c) {
        return {
            idCita: c.idCita === 0 ? undefined : c.idCita,
            dniPaciente: c.dniPaciente,
            idMedico: c.idMedico,
            idHorario: c.idHorario,
            estado: c.estado
        };
    }
}
exports.CitaMapper = CitaMapper;
//# sourceMappingURL=CitaMapper.js.map