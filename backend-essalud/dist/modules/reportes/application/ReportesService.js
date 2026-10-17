"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesService = void 0;
const ExcelJS = __importStar(require("exceljs"));
class ReportesService {
    reportesRepository;
    constructor(reportesRepository) {
        this.reportesRepository = reportesRepository;
    }
    async obtenerResumen() {
        return await this.reportesRepository.obtenerResumen();
    }
    async listarCitasReporte(fechaInicio, fechaFin, idEspecialidad, estado) {
        return await this.reportesRepository.listarCitasReporte(fechaInicio, fechaFin, idEspecialidad, estado);
    }
    async listarPacientesReporte() {
        return await this.reportesRepository.listarPacientesReporte();
    }
    async listarPersonalReporte(rol, idEspecialidad) {
        return await this.reportesRepository.listarPersonalReporte(rol, idEspecialidad);
    }
    async listarConsultasReporte(fechaInicio, fechaFin, idEspecialidad) {
        return await this.reportesRepository.listarConsultasReporte(fechaInicio, fechaFin, idEspecialidad);
    }
    async generarExcelCitas(fechaInicio, fechaFin, idEspecialidad, estado) {
        const citas = await this.listarCitasReporte(fechaInicio, fechaFin, idEspecialidad, estado);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Citas');
        worksheet.mergeCells('A1:I1');
        worksheet.getCell('A1').value = 'REPORTE DE CITAS MÉDICAS - ESSALUD';
        worksheet.getCell('A1').font = { bold: true, size: 14 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        worksheet.addRow([]);
        worksheet.addRow([
            'Fecha inicio',
            fechaInicio || 'No especificado',
            'Fecha fin',
            fechaFin || 'No especificado',
            'Especialidad',
            idEspecialidad || 'Todas',
            'Estado',
            estado || 'TODAS'
        ]);
        worksheet.addRow([]);
        const headerRow = worksheet.addRow([
            'ID Cita',
            'DNI Paciente',
            'Paciente',
            'Médico',
            'Especialidad',
            'Fecha',
            'Hora Inicio',
            'Hora Fin',
            'Estado'
        ]);
        headerRow.font = { bold: true };
        citas.forEach((cita) => {
            worksheet.addRow([
                cita.idCita,
                cita.dniPaciente,
                cita.paciente,
                cita.medico,
                cita.especialidad || 'Sin especialidad',
                cita.fecha,
                cita.horaInicio,
                cita.horaFin,
                cita.estado
            ]);
        });
        worksheet.columns = [
            { width: 10 },
            { width: 15 },
            { width: 30 },
            { width: 30 },
            { width: 22 },
            { width: 15 },
            { width: 15 },
            { width: 15 },
            { width: 15 }
        ];
        this.aplicarAlineacion(worksheet);
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async generarExcelPacientes() {
        const pacientes = await this.listarPacientesReporte();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Pacientes');
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').value = 'REPORTE DE PACIENTES ASEGURADOS - ESSALUD';
        worksheet.getCell('A1').font = { bold: true, size: 14 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        worksheet.addRow([]);
        const headerRow = worksheet.addRow([
            'DNI',
            'Nombres',
            'Apellidos',
            'Fecha de nacimiento'
        ]);
        headerRow.font = { bold: true };
        pacientes.forEach((paciente) => {
            worksheet.addRow([
                paciente.dni,
                paciente.nombre,
                paciente.apellidos,
                paciente.fecNac
            ]);
        });
        worksheet.columns = [
            { width: 15 },
            { width: 25 },
            { width: 30 },
            { width: 22 }
        ];
        this.aplicarAlineacion(worksheet);
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async generarExcelPersonal(rol, idEspecialidad) {
        const personal = await this.listarPersonalReporte(rol, idEspecialidad);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Personal');
        worksheet.mergeCells('A1:F1');
        worksheet.getCell('A1').value = 'REPORTE DE PERSONAL REGISTRADO - ESSALUD';
        worksheet.getCell('A1').font = { bold: true, size: 14 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        worksheet.addRow([]);
        worksheet.addRow([
            'Rol / Área',
            rol || 'TODOS',
            'Especialidad',
            idEspecialidad || 'Todas'
        ]);
        worksheet.addRow([]);
        const headerRow = worksheet.addRow([
            'DNI',
            'Nombres',
            'Apellidos',
            'Rol / Área',
            'Colegiatura',
            'Especialidad'
        ]);
        headerRow.font = { bold: true };
        personal.forEach((persona) => {
            worksheet.addRow([
                persona.dni,
                persona.nombre,
                persona.apellidos,
                persona.rol,
                persona.colegiatura || 'No aplica',
                persona.especialidad || 'No aplica'
            ]);
        });
        worksheet.columns = [
            { width: 15 },
            { width: 25 },
            { width: 30 },
            { width: 22 },
            { width: 18 },
            { width: 25 }
        ];
        this.aplicarAlineacion(worksheet);
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async generarExcelConsultas(fechaInicio, fechaFin, idEspecialidad) {
        const consultas = await this.listarConsultasReporte(fechaInicio, fechaFin, idEspecialidad);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Consultas Médicas');
        worksheet.mergeCells('A1:J1');
        worksheet.getCell('A1').value = 'REPORTE DE CONSULTAS MÉDICAS - ESSALUD';
        worksheet.getCell('A1').font = { bold: true, size: 14 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        worksheet.addRow([]);
        worksheet.addRow([
            'Fecha inicio',
            fechaInicio || 'No especificado',
            'Fecha fin',
            fechaFin || 'No especificado',
            'Especialidad',
            idEspecialidad || 'Todas'
        ]);
        worksheet.addRow([]);
        const headerRow = worksheet.addRow([
            'ID Consulta',
            'ID Cita',
            'DNI Paciente',
            'Paciente',
            'Médico',
            'Especialidad',
            'Diagnóstico',
            'Observaciones',
            'Fecha atención',
            'Estado cita'
        ]);
        headerRow.font = { bold: true };
        consultas.forEach((consulta) => {
            worksheet.addRow([
                consulta.idConsulta,
                consulta.idCita,
                consulta.dniPaciente,
                consulta.paciente,
                consulta.medico,
                consulta.especialidad || 'Sin especialidad',
                consulta.diagnostico,
                consulta.observaciones || '',
                consulta.fechaAtencion,
                consulta.estadoCita
            ]);
        });
        worksheet.columns = [
            { width: 12 },
            { width: 10 },
            { width: 15 },
            { width: 30 },
            { width: 30 },
            { width: 22 },
            { width: 35 },
            { width: 45 },
            { width: 22 },
            { width: 15 }
        ];
        this.aplicarAlineacion(worksheet);
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async generarExcelMedicamentosBajoStock() {
        const medicamentos = await this.reportesRepository.listarMedicamentosBajoStock();
        return this.generarExcelMedicamentos(medicamentos, 'REPORTE DE MEDICAMENTOS BAJO STOCK - ESSALUD', 'Bajo Stock');
    }
    async generarExcelMedicamentosPorVencer() {
        const medicamentos = await this.reportesRepository.listarMedicamentosPorVencer();
        return this.generarExcelMedicamentos(medicamentos, 'REPORTE DE MEDICAMENTOS POR VENCER - ESSALUD', 'Por Vencer');
    }
    async generarExcelMedicamentos(medicamentos, titulo, nombreHoja) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(nombreHoja);
        worksheet.mergeCells('A1:F1');
        worksheet.getCell('A1').value = titulo;
        worksheet.getCell('A1').font = { bold: true, size: 14 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        worksheet.addRow([]);
        const headerRow = worksheet.addRow([
            'ID',
            'Medicamento',
            'Composición',
            'Stock actual',
            'Stock mínimo',
            'Fecha de vencimiento'
        ]);
        headerRow.font = { bold: true };
        medicamentos.forEach((medicamento) => {
            worksheet.addRow([
                medicamento.idMedicamento,
                medicamento.nombreMedicamento,
                medicamento.composicion,
                medicamento.stockActual,
                medicamento.stockMinimo,
                medicamento.fechaVencimiento
            ]);
        });
        worksheet.columns = [
            { width: 10 },
            { width: 30 },
            { width: 35 },
            { width: 15 },
            { width: 15 },
            { width: 22 }
        ];
        this.aplicarAlineacion(worksheet);
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    aplicarAlineacion(worksheet) {
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'left',
                    wrapText: true
                };
            });
        });
    }
}
exports.ReportesService = ReportesService;
//# sourceMappingURL=ReportesService.js.map