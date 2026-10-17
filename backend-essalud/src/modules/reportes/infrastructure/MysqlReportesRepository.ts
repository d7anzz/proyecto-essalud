import { DataSource } from 'typeorm';
import {
  ReportesRepository,
  ResumenReportes,
  CitaReporte,
  PacienteReporte,
  PersonalReporte,
  ConsultaReporte,
  MedicamentoReporte
} from '../domain/ReportesRepository';

export class MysqlReportesRepository implements ReportesRepository {
  constructor(private readonly dataSource: DataSource) {}

  private async contar(sql: string): Promise<number> {
    const resultado = await this.dataSource.query(sql);
    return Number(resultado[0]?.total ?? 0);
  }

  async obtenerResumen(): Promise<ResumenReportes> {
    const [
      totalPacientes,
      totalPersonal,
      citasPendientes,
      citasCompletadas,
      citasCanceladas,
      totalConsultas,
      medicamentosBajoStock,
      medicamentosPorVencer
    ] = await Promise.all([
      this.contar('SELECT COUNT(*) AS total FROM pacientes'),
      this.contar('SELECT COUNT(*) AS total FROM personal_salud'),
      this.contar("SELECT COUNT(*) AS total FROM citas_medicas WHERE estado = 'PENDIENTE'"),
      this.contar("SELECT COUNT(*) AS total FROM citas_medicas WHERE estado = 'COMPLETADA'"),
      this.contar("SELECT COUNT(*) AS total FROM citas_medicas WHERE estado = 'CANCELADA'"),
      this.contar('SELECT COUNT(*) AS total FROM consultas_medicas'),
      this.contar('SELECT COUNT(*) AS total FROM medicamentos WHERE stock_actual <= stock_minimo'),
      this.contar("SELECT COUNT(*) AS total FROM medicamentos WHERE fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 90 DAY)")
    ]);

    return {
      totalPacientes,
      totalPersonal,
      citasPendientes,
      citasCompletadas,
      citasCanceladas,
      totalConsultas,
      medicamentosBajoStock,
      medicamentosPorVencer
    };
  }

  async listarCitasReporte(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string,
    estado?: string
  ): Promise<CitaReporte[]> {
    let sql = `
      SELECT
        c.id_cita AS idCita,
        p.dni AS dniPaciente,
        CONCAT(p.nombre, ' ', p.apellidos) AS paciente,
        CONCAT(ps.nombre, ' ', ps.apellidos) AS medico,
        e.nombre_especialidad AS especialidad,
        h.fecha AS fecha,
        h.horaInicio AS horaInicio,
        h.horaFin AS horaFin,
        h.turno AS turno,
        c.estado AS estado
      FROM citas_medicas c
      INNER JOIN pacientes p 
        ON p.dni = c.dni_paciente
      INNER JOIN personal_salud ps 
        ON ps.dni = c.id_medico
      LEFT JOIN especialidades e 
        ON e.id_especialidad = ps.id_especialidad
      INNER JOIN horarios_disponibles h 
        ON h.id = c.id_horario
      WHERE 1 = 1
    `;

    const params: any[] = [];

    if (fechaInicio) {
      sql += ` AND h.fecha >= ?`;
      params.push(fechaInicio);
    }

    if (fechaFin) {
      sql += ` AND h.fecha <= ?`;
      params.push(fechaFin);
    }

    if (idEspecialidad) {
      sql += ` AND e.id_especialidad = ?`;
      params.push(idEspecialidad);
    }

    if (estado && estado !== 'TODAS') {
      sql += ` AND c.estado = ?`;
      params.push(estado);
    }

    sql += `
      ORDER BY h.fecha ASC, h.horaInicio ASC
    `;

    const resultado = await this.dataSource.query(sql, params);

    return resultado as CitaReporte[];
  }

  async listarPacientesReporte(): Promise<PacienteReporte[]> {
    const sql = `
      SELECT
        dni,
        nombre,
        apellidos,
        fec_nac AS fecNac
      FROM pacientes
      ORDER BY apellidos ASC, nombre ASC
    `;

    const resultado = await this.dataSource.query(sql);

    return resultado as PacienteReporte[];
  }

  async listarPersonalReporte(
    rol?: string,
    idEspecialidad?: string
  ): Promise<PersonalReporte[]> {
    let sql = `
      SELECT
        ps.dni AS dni,
        ps.nombre AS nombre,
        ps.apellidos AS apellidos,
        r.nombre_rol AS rol,
        ps.colegiatura AS colegiatura,
        e.nombre_especialidad AS especialidad
      FROM personal_salud ps
      INNER JOIN usuarios u
        ON u.dni = ps.dni
      INNER JOIN roles r
        ON r.id_rol = u.id_rol
      LEFT JOIN especialidades e
        ON e.id_especialidad = ps.id_especialidad
      WHERE 1 = 1
    `;

    const params: any[] = [];

    if (rol && rol !== 'TODOS') {
      sql += ` AND r.nombre_rol = ?`;
      params.push(rol);
    }

    if (idEspecialidad) {
      sql += ` AND e.id_especialidad = ?`;
      params.push(idEspecialidad);
    }

    sql += `
      ORDER BY r.nombre_rol ASC, e.nombre_especialidad ASC, ps.apellidos ASC
    `;

    const resultado = await this.dataSource.query(sql, params);

    return resultado as PersonalReporte[];
  }

  async listarConsultasReporte(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string
  ): Promise<ConsultaReporte[]> {
    let sql = `
      SELECT
        cm.id_consulta AS idConsulta,
        cm.id_cita AS idCita,
        p.dni AS dniPaciente,
        CONCAT(p.nombre, ' ', p.apellidos) AS paciente,
        CONCAT(ps.nombre, ' ', ps.apellidos) AS medico,
        e.nombre_especialidad AS especialidad,
        cm.diagnostico AS diagnostico,
        cm.observaciones AS observaciones,
        cm.fecha_atencion AS fechaAtencion,
        c.estado AS estadoCita
      FROM consultas_medicas cm
      INNER JOIN citas_medicas c
        ON c.id_cita = cm.id_cita
      INNER JOIN pacientes p
        ON p.dni = cm.dni_paciente
      INNER JOIN personal_salud ps
        ON ps.dni = cm.id_medico
      LEFT JOIN especialidades e
        ON e.id_especialidad = ps.id_especialidad
      WHERE 1 = 1
    `;

    const params: any[] = [];

    if (fechaInicio) {
      sql += ` AND DATE(cm.fecha_atencion) >= ?`;
      params.push(fechaInicio);
    }

    if (fechaFin) {
      sql += ` AND DATE(cm.fecha_atencion) <= ?`;
      params.push(fechaFin);
    }

    if (idEspecialidad) {
      sql += ` AND e.id_especialidad = ?`;
      params.push(idEspecialidad);
    }

    sql += `
      ORDER BY cm.fecha_atencion ASC
    `;

    const resultado = await this.dataSource.query(sql, params);

    return resultado as ConsultaReporte[];
  }

  async listarMedicamentosBajoStock(): Promise<MedicamentoReporte[]> {
    const sql = `
      SELECT
        id_medicamento AS idMedicamento,
        nombre_medicamento AS nombreMedicamento,
        composicion,
        stock_actual AS stockActual,
        stock_minimo AS stockMinimo,
        fecha_vencimiento AS fechaVencimiento
      FROM medicamentos
      WHERE stock_actual <= stock_minimo
      ORDER BY stock_actual ASC, nombre_medicamento ASC
    `;

    const resultado = await this.dataSource.query(sql);

    return resultado as MedicamentoReporte[];
  }

  async listarMedicamentosPorVencer(): Promise<MedicamentoReporte[]> {
    const sql = `
      SELECT
        id_medicamento AS idMedicamento,
        nombre_medicamento AS nombreMedicamento,
        composicion,
        stock_actual AS stockActual,
        stock_minimo AS stockMinimo,
        fecha_vencimiento AS fechaVencimiento
      FROM medicamentos
      WHERE fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 90 DAY)
      ORDER BY fecha_vencimiento ASC, nombre_medicamento ASC
    `;

    const resultado = await this.dataSource.query(sql);

    return resultado as MedicamentoReporte[];
  }
}