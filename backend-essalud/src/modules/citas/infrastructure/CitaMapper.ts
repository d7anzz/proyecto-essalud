import { CitaModel } from './CitaModel';
import { Cita } from '../domain/Cita';

export class CitaMapper {
  static toDomain(m: CitaModel): Cita {
    const cita = new Cita(
      m.idCita,
      m.dniPaciente,
      m.idMedico,
      m.idHorario,
      m.estado,
      m.fechaCreacion
    );

    if (m.paciente) {
      (cita as any).nombrePaciente = `${m.paciente.nombre} ${m.paciente.apellidos}`;
    }
    
    if (m.horario) {
      (cita as any).infoHorario = {
        fecha: m.horario.fecha,
        horaInicio: m.horario.horaInicio,
        turno: m.horario.turno
      };
      
      if (m.horario.personal) {
        const personalAsAny = m.horario.personal as any;
        (cita as any).nombreMedico = `${m.horario.personal.nombre} ${m.horario.personal.apellidos}`;
        (cita as any).personal = {
          nombre: m.horario.personal.nombre,
          apellidos: m.horario.personal.apellidos,
          especialidad: personalAsAny.especialidad?.nombre || 'General'
        };
      } else {
        (cita as any).nombreMedico = `Médico DNI: ${m.idMedico}`;
      }
    }

    return cita;
  }

  static toPersistence(c: Cita): Partial<CitaModel> {
    return {
      idCita: c.idCita === 0 ? undefined : c.idCita, 
      dniPaciente: c.dniPaciente,
      idMedico: c.idMedico,
      idHorario: c.idHorario,
      estado: c.estado
    };
  }
}