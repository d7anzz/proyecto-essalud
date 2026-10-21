import { Paciente } from '../domain/Paciente';
import { PacienteModel } from './PacienteModel';

export class PacienteMapper {
  static toDomain(model: PacienteModel): Paciente {
    return new Paciente(
      model.dni,
      model.nombre,
      model.apellidos,
      model.fechaNacimiento,
      model.sexo,
      model.telefono,
      model.tipoSeguro,
      model.grupoSanguineo
    );
  }

  static toPersistence(paciente: Paciente): PacienteModel {
    const model = new PacienteModel();
    model.dni = paciente.dni;
    model.nombre = paciente.nombre;
    model.apellidos = paciente.apellidos;
    model.fechaNacimiento = paciente.fechaNacimiento;
    model.sexo = paciente.sexo;
    model.telefono = paciente.telefono;
    model.tipoSeguro = paciente.tipoSeguro;
    model.grupoSanguineo = paciente.grupoSanguineo;
    return model;
  }
}