"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultaMapper = void 0;
const Consulta_1 = require("../domain/Consulta");
class ConsultaMapper {
    static toDomain(m) {
        return new Consulta_1.Consulta(m.idConsulta, m.idCita, m.dniPaciente, m.idMedico, m.diagnostico, m.observaciones, m.fechaAtencion);
    }
}
exports.ConsultaMapper = ConsultaMapper;
//# sourceMappingURL=ConsultaMapper.js.map