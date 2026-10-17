"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmaciaService = void 0;
const Medicamento_1 = require("../domain/Medicamento");
class FarmaciaService {
    repo;
    ROL_MEDICO = 1; // 🩺 Añadimos el Rol del Médico
    ROL_FARMACIA = 3; // 💊 Personal de Farmacia
    ROL_AUDITOR = 4; // 💼 Superusuario / Auditor
    constructor(repo) {
        this.repo = repo;
    }
    // 🔒 Mantenemos este permiso estricto para operaciones de modificación (escribir/actualizar)
    verificarPermisoExclusivoFarmacia(rol) {
        if (rol !== this.ROL_FARMACIA) {
            throw new Error('Acceso denegado: Operación exclusiva para el Personal de Farmacia (Rol 3).');
        }
    }
    // 🔓 REGLA DE LECTURA FLEXIBLE: Permitimos que Médico, Farmacia y Auditor vean el stock
    async obtenerInventario(rolEjecutor) {
        if (rolEjecutor !== this.ROL_MEDICO && rolEjecutor !== this.ROL_FARMACIA && rolEjecutor !== this.ROL_AUDITOR) {
            throw new Error('Acceso denegado: No tiene permisos de lectura sobre el inventario.');
        }
        return await this.repo.listarInventario();
    }
    async registrarMedicamento(dto, rolEjecutor) {
        this.verificarPermisoExclusivoFarmacia(rolEjecutor); // 🔒 Protegido
        if (dto.cantidadIngreso <= 0 || dto.stockMinimo < 0) {
            throw new Error('🚫 Validación: Las cantidades y stocks mínimos no pueden ser negativos o cero.');
        }
        const hoy = new Date().toISOString().split('T')[0];
        if (dto.fechaVencimiento <= hoy) {
            throw new Error('🚫 Validación: No se puede ingresar un lote de medicamentos vencido.');
        }
        const nuevoMedicamento = new Medicamento_1.Medicamento(0, dto.nombreMedicamento.trim(), dto.composicion.trim(), dto.cantidadIngreso, dto.stockMinimo, dto.fechaVencimiento);
        return await this.repo.ingresarMedicamento(nuevoMedicamento);
    }
    async obtenerRecetasPendientes(rolEjecutor, dniPaciente) {
        this.verificarPermisoExclusivoFarmacia(rolEjecutor); // 🔒 Protegido
        return await this.repo.listarRecetasPendientes(dniPaciente?.trim());
    }
    async despacharReceta(dto, rolEjecutor) {
        this.verificarPermisoExclusivoFarmacia(rolEjecutor); // 🔒 Protegido
        if (!dto.idOrden || !dto.idMedicamento || dto.cantidadEntregada <= 0) {
            throw new Error('🚫 Validación: Datos de despacho inválidos o cantidad igual a cero.');
        }
        await this.repo.despacharRecetaTransaccional(dto.idOrden, dto.idMedicamento, dto.cantidadEntregada);
    }
}
exports.FarmaciaService = FarmaciaService;
//# sourceMappingURL=FarmaciaService.js.map