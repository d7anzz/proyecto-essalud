"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitaService = void 0;
const Cita_1 = require("../domain/Cita");
class CitaService {
    repo;
    horarioRepo;
    ROL_ADMINISTRATIVO = 2;
    ROL_MEDICO = 1;
    constructor(repo, horarioRepo) {
        this.repo = repo;
        this.horarioRepo = horarioRepo;
    }
    async crear(dto, rolEjecutor) {
        if (rolEjecutor !== this.ROL_ADMINISTRATIVO) {
            throw new Error('Acceso denegado: Solo el personal administrativo (Rol 2) está autorizado para agendar citas.');
        }
        const horario = await this.horarioRepo.obtenerPorId(Number(dto.idHorario));
        if (!horario) {
            throw new Error('🚫 Error de Consistencia: El bloque de horario seleccionado no existe en el sistema.');
        }
        if (horario.estado !== 'DISPONIBLE') {
            throw new Error('🚫 Conflicto de Cita: Este bloque horario ya fue asignado a otra cita médica.');
        }
        await this.horarioRepo.actualizar(horario.id, { estado: 'OCUPADO' });
        const cita = new Cita_1.Cita(0, dto.dniPaciente, horario.dni, horario.id, 'PENDIENTE');
        try {
            const nuevaCita = await this.repo.crear(cita);
            if (horario && horario.personal) {
                nuevaCita.personal = {
                    nombre: horario.personal.nombre,
                    apellidos: horario.personal.apellidos,
                    especialidad: horario.personal.especialidad
                };
            }
            return nuevaCita;
        }
        catch (error) {
            await this.horarioRepo.actualizar(horario.id, { estado: 'DISPONIBLE' });
            throw error;
        }
    }
    async listar(rolEjecutor, dniUsuarioLogueado) {
        const todasLasCitas = await this.repo.listar();
        const citasHidratadas = await Promise.all(todasLasCitas.map(async (cita) => {
            if (cita.idHorario) {
                const horarioAsociado = await this.horarioRepo.obtenerPorId(cita.idHorario);
                if (horarioAsociado && horarioAsociado.personal) {
                    cita.personal = {
                        nombre: horarioAsociado.personal.nombre,
                        apellidos: horarioAsociado.personal.apellidos,
                        especialidad: horarioAsociado.personal.especialidad
                    };
                }
            }
            return cita;
        }));
        if (rolEjecutor === this.ROL_MEDICO) {
            return citasHidratadas.filter(c => c.idMedico === dniUsuarioLogueado);
        }
        return citasHidratadas;
    }
    async obtenerPorId(id, rolEjecutor, dniUsuarioLogueado) {
        const cita = await this.repo.obtenerPorId(id);
        if (!cita)
            return null;
        if (rolEjecutor === this.ROL_MEDICO && cita.idMedico !== dniUsuarioLogueado) {
            throw new Error('Acceso denegado: No tienes permisos para visualizar esta cita.');
        }
        if (cita.idHorario) {
            const horarioAsociado = await this.horarioRepo.obtenerPorId(cita.idHorario);
            if (horarioAsociado && horarioAsociado.personal) {
                cita.personal = {
                    nombre: horarioAsociado.personal.nombre,
                    apellidos: horarioAsociado.personal.apellidos,
                    especialidad: horarioAsociado.personal.especialidad
                };
            }
        }
        return cita;
    }
    async actualizar(id, data, rolEjecutor) {
        const citaExistente = await this.repo.obtenerPorId(id);
        if (!citaExistente)
            throw new Error('La cita solicitada no existe.');
        if (data.estado === 'CANCELADA') {
            await this.horarioRepo.actualizar(citaExistente.idHorario, { estado: 'DISPONIBLE' });
        }
        return this.repo.actualizar(id, data);
    }
    async eliminar(id, rolEjecutor) {
        if (rolEjecutor !== this.ROL_ADMINISTRATIVO) {
            throw new Error('Acceso denegado: Solo el personal administrativo puede remover registros del sistema.');
        }
        const citaExistente = await this.repo.obtenerPorId(id);
        if (!citaExistente)
            throw new Error('La cita solicitada no existe.');
        await this.horarioRepo.actualizar(citaExistente.idHorario, { estado: 'DISPONIBLE' });
        return this.repo.eliminar(id);
    }
}
exports.CitaService = CitaService;
//# sourceMappingURL=CitaService.js.map