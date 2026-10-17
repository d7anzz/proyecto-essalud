"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultaService = void 0;
const Consulta_1 = require("../domain/Consulta");
class ConsultaService {
    repo;
    ROL_MEDICO = 1;
    constructor(repo) {
        this.repo = repo;
    }
    async crearConsultaMedica(dto, rolEjecutor) {
        // 🛡️ Regla de oro: Solo el médico puede diagnosticar
        if (rolEjecutor !== this.ROL_MEDICO) {
            throw new Error('Acceso denegado: Solo el personal Médico (Rol 1) está autorizado para emitir diagnósticos y recetas.');
        }
        // 🚫 Validaciones de campos obligatorios institucionales
        if (!dto.idCita || !dto.dniPaciente || !dto.idMedico) {
            throw new Error('🚫 Validación: La información de la cita, paciente y médico son obligatorios.');
        }
        if (!dto.diagnostico || dto.diagnostico.trim().length < 5) {
            throw new Error('🚫 Validación: Debes ingresar un diagnóstico clínico válido y descriptivo.');
        }
        // Adaptamos el DTO a la entidad de dominio limpia
        const nuevaConsulta = new Consulta_1.Consulta(0, dto.idCita, dto.dniPaciente, dto.idMedico, dto.diagnostico.trim(), dto.observaciones.trim());
        const medicamentosRecetados = dto.medicamentos || [];
        // Enviamos al repositorio transaccional
        await this.repo.crearTransaccional(nuevaConsulta, medicamentosRecetados);
    }
}
exports.ConsultaService = ConsultaService;
//# sourceMappingURL=ConsultaService.js.map