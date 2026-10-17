"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalMapper = void 0;
const Personal_1 = require("../domain/Personal");
const PersonalModel_1 = require("./PersonalModel");
class PersonalMapper {
    static toDomain(model, idRol) {
        return new Personal_1.Personal(model.dni, model.nombre, model.apellidos, idRol, model.colegiatura, model.idEspecialidad, model.especialidad?.nombre);
    }
    static toPersistence(entity) {
        const model = new PersonalModel_1.PersonalModel();
        model.dni = entity.dni;
        model.nombre = entity.nombre;
        model.apellidos = entity.apellidos;
        model.colegiatura = entity.colegiatura;
        model.idEspecialidad = entity.idEspecialidad;
        return model;
    }
}
exports.PersonalMapper = PersonalMapper;
//# sourceMappingURL=PersonalMapper.js.map