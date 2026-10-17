import { HorarioModel } from './HorarioModel';
import { Horario } from '../domain/Horario';
import { HorarioBuilder } from '../domain/HorarioBuilder';

export class HorarioMapper {
  static toDomain(m: HorarioModel): Horario {
    const estadoDominio: 'DISPONIBLE' | 'OCUPADO' = m.estado ? 'DISPONIBLE' : 'OCUPADO';

    const horario = new HorarioBuilder()
      .conId(m.id)
      .conDni(m.dni)
      .conFecha(m.fecha)
      .conHoraInicio(m.horaInicio)
      .conHoraFin(m.horaFin)
      .conTurno(m.turno)
      .conEstado(estadoDominio)
      .build();

    if (m.personal) {
      const personalAsAny = m.personal as any;
      (horario as any).personal = {
        nombre: m.personal.nombre,
        apellidos: m.personal.apellidos,
        colegiatura: m.personal.colegiatura || null,
        id_especialidad: personalAsAny.id_especialidad ?? personalAsAny.idEspecialidad ?? null,
        especialidad: m.personal.especialidad?.nombre || 'General'
      };
    }

    return horario;
  }

  static toPersistence(d: Horario): Partial<HorarioModel> {
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