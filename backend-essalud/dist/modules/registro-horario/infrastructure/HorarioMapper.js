"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioMapper = void 0;
const HorarioBuilder_1 = require("../domain/HorarioBuilder");
class HorarioMapper {
    static toDomain(m) {
        const estadoDominio = m.estado ? 'DISPONIBLE' : 'OCUPADO';
        const horario = new HorarioBuilder_1.HorarioBuilder()
            .conId(m.id)
            .conDni(m.dni)
            .conFecha(m.fecha)
            .conHoraInicio(m.horaInicio)
            .conHoraFin(m.horaFin)
            .conTurno(m.turno)
            .conEstado(estadoDominio)
            .build();
        if (m.personal) {
            const personalAsAny = m.personal;
            horario.personal = {
                nombre: m.personal.nombre,
                apellidos: m.personal.apellidos,
                colegiatura: m.personal.colegiatura || null,
                id_especialidad: personalAsAny.id_especialidad ?? personalAsAny.idEspecialidad ?? null,
                especialidad: m.personal.especialidad?.nombre || 'General'
            };
        }
        return horario;
    }
    static toPersistence(d) {
        const esDisponible = d.estado === 'DISPONIBLE' || d.estado === true;
        return {
            id: d.id === 0 ? undefined : d.id,
            dni: d.dni,
            fecha: d.fecha,
            horaInicio: d.horaInicio,
            horaFin: d.horaFin,
            turno: d.turno,
            estado: esDisponible
        };
    }
}
exports.HorarioMapper = HorarioMapper;
//# sourceMappingURL=HorarioMapper.js.map