import { Personal } from '../domain/Personal';
import { PersonalModel } from './PersonalModel';

export class PersonalMapper {
  public static toDomain(model: PersonalModel, idRol: number): Personal {
    return new Personal(
      model.dni,
      model.nombre,
      model.apellidos,
      idRol, 
      model.colegiatura,
      model.idEspecialidad,
      model.especialidad?.nombre,
      model.telefono,
      model.fecNac
    );
  }

  public static toPersistence(entity: Personal): PersonalModel {
    const model = new PersonalModel();
    model.dni = entity.dni;
    model.nombre = entity.nombre;
    model.apellidos = entity.apellidos;
    model.colegiatura = entity.colegiatura;
    model.idEspecialidad = entity.idEspecialidad;
    model.telefono = entity.telefono;
    model.fecNac = entity.fecNac ? new Date(entity.fecNac) : null;
    return model;
  }
}