import { ConsultaModel } from './ConsultaModel';
import { Consulta } from '../domain/Consulta';

export class ConsultaMapper {
  static toDomain(m: ConsultaModel): Consulta {
    return new Consulta(
      m.idConsulta,
      m.idCita,
      m.dniPaciente,
      m.idMedico,
      m.diagnostico,
      m.observaciones,
      m.fechaAtencion
    );
  }
}