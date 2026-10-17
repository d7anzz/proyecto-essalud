import { Paciente } from '../domain/Paciente';
import { PacienteModel } from './PacienteModel';

export class PacienteMapper {
  static toDomain(model: PacienteModel): Paciente {
    return new Paciente(
      model.dni,
      model.nombre,
      model.apellidos,
      model.fechaNacimiento
    );
  }

  static toPersistence(paciente: Paciente): PacienteModel {
    const model = new PacienteModel();
    model.dni = paciente.dni;
    model.nombre = paciente.nombre;
    model.apellidos = paciente.apellidos;
    model.fechaNacimiento = paciente.fechaNacimiento;
    return model;
  }
}