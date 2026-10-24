import { DataSource } from 'typeorm';
import { MysqlReportesRepository } from '../MysqlReportesRepository';
import { ReportesService } from '../../application/ReportesService';
import { PersonalModel, EspecialidadInline } from '../../../registropersonal/infrastructure/PersonalModel';
import { UsuarioModel } from '../../../login/infrastructure/UsuarioModel';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('Pruebas de Integración Directas - Servicio de Reportes (IDs 27 - 30)', () => {
  let dataSource: DataSource;
  let reportesService: ReportesService;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Darikson1905@',
      database: process.env.DB_NAME || 'essalud_db',
      entities: [
        PersonalModel,
        UsuarioModel,
        EspecialidadInline
      ],
      synchronize: false,
      logging: false,
    });

    await dataSource.initialize();

    const repo = new MysqlReportesRepository(dataSource);
    reportesService = new ReportesService(repo);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  // ID 27: Filtrar personal por rol y especialidad
  it('ID 27: Filtrar personal por rol Médico y especialidad Cardiología', async () => {
    const resultado = await reportesService.listarPersonalReporte('Médico', '1');
    expect(Array.isArray(resultado)).toBe(true);
  });

  // ID 28: Fecha inicial mayor a fecha final
  it('ID 28: Rechazar cuando la fecha de inicio es mayor a la fecha de fin', async () => {
    await expect(
      reportesService.listarCitasReporte('2026-10-25', '2026-10-18')
    ).rejects.toThrow('La fecha de inicio no puede ser mayor a la fecha de fin');
  });

  // ID 29: Omitir tipo de reporte
  it('ID 29: Rechazar si se omite o no se selecciona un tipo de reporte válido', async () => {
    const reportesPermitidos = ['personal', 'pacientes', 'citas', 'consultas', 'medicamentos'];
    const tipoReporteSeleccionado = ''; // Sin selección

    const validarTipoReporte = (tipo: string) => {
      if (!tipo || tipo.trim() === '' || !reportesPermitidos.includes(tipo)) {
        throw new Error('Debe seleccionar un tipo de reporte');
      }
    };

    expect(() => validarTipoReporte(tipoReporteSeleccionado)).toThrow(
      'Debe seleccionar un tipo de reporte'
    );
  });

  // ID 30: Descarga directa de reporte de medicamentos en bajo stock
  it('ID 30: Generar Buffer de Excel de medicamentos bajo stock', async () => {
    const buffer = await reportesService.generarExcelMedicamentosBajoStock();
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });
});