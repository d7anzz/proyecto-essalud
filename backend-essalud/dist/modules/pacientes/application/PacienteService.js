"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacienteService = void 0;
const PacienteBuilder_1 = require("../domain/PacienteBuilder");
class PacienteService {
    pacienteRepository;
    ROLES_PERMITIDOS = [2];
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }
    async ejecutar(dto, rolEjecutor) {
        if (!this.ROLES_PERMITIDOS.includes(rolEjecutor)) {
            throw new Error('Acceso denegado: Solo el personal Administrativo está autorizado para registrar nuevos pacientes.');
        }
        const existePaciente = await this.pacienteRepository.buscarPorDni(dto.dni);
        if (existePaciente) {
            throw new Error("El paciente con este DNI ya está registrado.");
        }
        const nuevoPaciente = new PacienteBuilder_1.PacienteBuilder()
            .setDni(dto.dni)
            .setNombre(dto.nombre)
            .setApellidos(dto.apellidos)
            .setFechaNacimiento(dto.fechaNacimiento)
            .build();
        await this.pacienteRepository.guardar(nuevoPaciente);
    }
    async listarPacientes() {
        return await this.pacienteRepository.obtenerTodos();
    }
    async buscarPorDni(dni) {
        return await this.pacienteRepository.buscarCoincidenciasPorDni(dni);
    }
    async actualizarPaciente(dni, dto) {
        const pacienteExistente = await this.pacienteRepository.buscarPorDni(dni);
        if (!pacienteExistente) {
            throw new Error("El paciente que intenta modificar no existe en el sistema.");
        }
        const pacienteActualizado = new PacienteBuilder_1.PacienteBuilder()
            .setDni(dni)
            .setNombre(dto.nombre || pacienteExistente.nombre)
            .setApellidos(dto.apellidos || pacienteExistente.apellidos)
            .setFechaNacimiento(dto.fechaNacimiento || pacienteExistente.fechaNacimiento || pacienteExistente.fec_nac)
            .build();
        await this.pacienteRepository.guardar(pacienteActualizado);
    }
    async eliminarPaciente(dni) {
        const pacienteExistente = await this.pacienteRepository.buscarPorDni(dni);
        if (!pacienteExistente) {
            throw new Error("El paciente que intenta eliminar no se encuentra registrado.");
        }
        await this.pacienteRepository.eliminarPorDni(dni);
    }
}
exports.PacienteService = PacienteService;
//# sourceMappingURL=PacienteService.js.map