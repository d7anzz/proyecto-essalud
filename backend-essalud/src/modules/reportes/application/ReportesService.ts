import {
  ReportesRepository,
  ResumenReportes,
  PacienteReporte,
  PersonalReporte,
  ConsultaReporte,
  MedicamentoReporte
} from '../domain/ReportesRepository';

import * as ExcelJS from 'exceljs';

export class ReportesService {
  private readonly ROLES_VALIDOS = [
    'MÉDICO',
    'MEDICO',
    'ENFERMERO',
    'FARMACÉUTICO',
    'FARMACEUTICO',
    'ADMINISTRATIVO'
  ];
  private readonly ESPECIALIDADES_VALIDAS = [1, 2, 3, 4, 5];

  constructor(private readonly reportesRepository: ReportesRepository) {}

  async obtenerResumen(): Promise<ResumenReportes> {
    return await this.reportesRepository.obtenerResumen();
  }

  async listarCitasReporte(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string,
    estado?: string
  ): Promise<any[]> {
    this.validarRangoFechas(fechaInicio, fechaFin);
    this.validarEspecialidad(idEspecialidad);

    return await this.reportesRepository.listarCitasReporte(
      fechaInicio,
      fechaFin,
      idEspecialidad,
      estado
    );
  }

  async listarPacientesReporte(): Promise<PacienteReporte[]> {
    return await this.reportesRepository.listarPacientesReporte();
  }

  async listarPersonalReporte(
    rol?: string,
    idEspecialidad?: string
  ): Promise<PersonalReporte[]> {
    if (rol && rol !== 'TODOS') {
      const rolUpper = rol.toUpperCase().trim();
      const esRolValido = this.ROLES_VALIDOS.includes(rolUpper);
      const idRolNum = Number(rol);

      if (!esRolValido && (isNaN(idRolNum) || idRolNum < 1 || idRolNum > 4)) {
        throw new Error('Rol no registrado');
      }
    }

    this.validarEspecialidad(idEspecialidad);

    return await this.reportesRepository.listarPersonalReporte(
      rol,
      idEspecialidad
    );
  }

  async listarConsultasReporte(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string
  ): Promise<ConsultaReporte[]> {
    this.validarRangoFechas(fechaInicio, fechaFin);
    this.validarEspecialidad(idEspecialidad);

    return await this.reportesRepository.listarConsultasReporte(
      fechaInicio,
      fechaFin,
      idEspecialidad
    );
  }

  private validarRangoFechas(fechaInicio?: string, fechaFin?: string): void {
    if (fechaInicio && !this.esFechaValida(fechaInicio)) {
      throw new Error('Formato no válido');
    }

    if (fechaFin && !this.esFechaValida(fechaFin)) {
      throw new Error('Formato no válido');
    }

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (inicio > fin) {
        throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin');
      }
    }
  }

  private esFechaValida(fechaStr: string): boolean {
    const regexISO = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexISO.test(fechaStr)) return false;

    const [anio, mes, dia] = fechaStr.split('-').map(Number) as [number, number, number];
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));

    return (
      fecha.getUTCFullYear() === anio &&
      fecha.getUTCMonth() + 1 === mes &&
      fecha.getUTCDate() === dia
    );
  }

  private validarEspecialidad(idEspecialidad?: string): void {
    if (idEspecialidad && idEspecialidad !== 'Todas') {
      const idNum = Number(idEspecialidad);
      if (isNaN(idNum) || !this.ESPECIALIDADES_VALIDAS.includes(idNum)) {
        throw new Error('Especialidad no registrada');
      }
    }
  }

  async generarExcelCitas(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string,
    estado?: string
  ): Promise<Buffer> {
    const citas = await this.listarCitasReporte(
      fechaInicio,
      fechaFin,
      idEspecialidad,
      estado
    );

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

    citas.forEach((cita: any) => {
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

  async generarExcelPacientes(): Promise<Buffer> {
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

    pacientes.forEach((paciente: PacienteReporte) => {
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

  async generarExcelPersonal(
    rol?: string,
    idEspecialidad?: string
  ): Promise<Buffer> {
    const personal = await this.listarPersonalReporte(
      rol,
      idEspecialidad
    );

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

    personal.forEach((persona: PersonalReporte) => {
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

  async generarExcelConsultas(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string
  ): Promise<Buffer> {
    const consultas = await this.listarConsultasReporte(
      fechaInicio,
      fechaFin,
      idEspecialidad
    );

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

    consultas.forEach((consulta: ConsultaReporte) => {
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

  async generarExcelMedicamentosBajoStock(): Promise<Buffer> {
    const medicamentos = await this.reportesRepository.listarMedicamentosBajoStock();

    return this.generarExcelMedicamentos(
      medicamentos,
      'REPORTE DE MEDICAMENTOS BAJO STOCK - ESSALUD',
      'Bajo Stock'
    );
  }

  async generarExcelMedicamentosPorVencer(): Promise<Buffer> {
    const medicamentos = await this.reportesRepository.listarMedicamentosPorVencer();

    return this.generarExcelMedicamentos(
      medicamentos,
      'REPORTE DE MEDICAMENTOS POR VENCER - ESSALUD',
      'Por Vencer'
    );
  }

  private async generarExcelMedicamentos(
    medicamentos: MedicamentoReporte[],
    titulo: string,
    nombreHoja: string
  ): Promise<Buffer> {
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

    medicamentos.forEach((medicamento: MedicamentoReporte) => {
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

  private aplicarAlineacion(worksheet: ExcelJS.Worksheet): void {
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