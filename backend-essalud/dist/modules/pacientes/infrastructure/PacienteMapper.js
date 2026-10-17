"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteMapper = void 0;
const Paciente_1 = require("../domain/Paciente");
const PacienteModel_1 = require("./PacienteModel");
class PacienteMapper {
    static toDomain(model) {
        return new Paciente_1.Paciente(model.dni, model.nombre, model.apellidos, model.fechaNacimiento);
    }
    static toPersistence(paciente) {
        const model = new PacienteModel_1.PacienteModel();
        model.dni = paciente.dni;
        model.nombre = paciente.nombre;
        model.apellidos = paciente.apellidos;
        model.fechaNacimiento = paciente.fechaNacimiento;
        return model;
    }
}
exports.PacienteMapper = PacienteMapper;
//# sourceMappingURL=PacienteMapper.js.map