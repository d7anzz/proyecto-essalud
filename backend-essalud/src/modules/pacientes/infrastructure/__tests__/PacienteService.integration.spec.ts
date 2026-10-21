import { DataSource } from 'typeorm';
import { MysqlPacienteRepository } from '../MysqlPacienteRepository';
import { PacienteModel } from '../PacienteModel';
import { PacienteService } from '../../application/PacienteService';
import { CreatePacienteDTO } from '../../application/CrearPacienteDTO';
import dotenv from 'dotenv';

dotenv.config();

describe('Pruebas de Integración: Módulo de Registro de Pacientes (Casos 1 al 3)', () => {
  let dataSource: DataSource;
  let pacienteRepository: MysqlPacienteRepository;
  let pacienteService: PacienteService;

  const ROL_ADMINISTRATIVO = 2; // Rol 2: Administrativo

  beforeAll(async () => {
    // Conexión real con MySQL mediante TypeORM usando tus variables de entorno o defaults
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Darikson1905@',
      database: process.env.DB_NAME || 'essalud_db',
      entities: [PacienteModel],
      synchronize: false, // Usamos la tabla real ya creada en MySQL
      logging: false,
    });

    await dataSource.initialize();

    const ormRepo = dataSource.getRepository(PacienteModel);
    pacienteRepository = new MysqlPacienteRepository(ormRepo);
    pacienteService = new PacienteService(pacienteRepository);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    // Limpiar registros de prueba antes de cada test para no dejar basura
    const repo = dataSource.getRepository(PacienteModel);
    await repo.delete({ dni: '12345678' });
    await repo.delete({ dni: '100000000' });
  });

  afterEach(async () => {
    // Limpiar registros creados tras finalizar la prueba
    const repo = dataSource.getRepository(PacienteModel);
    await repo.delete({ dni: '12345678' });
    await repo.delete({ dni: '100000000' });
  });

  // =========================================================
  // CASO INTEGRACIÓN 1: Registro Exitoso en MySQL
  // =========================================================
  it('ID 1 (Integración): Registrar paciente exitosamente con datos válidos y verificar persistencia en BD', async () => {
    const dto: CreatePacienteDTO = {
      dni: '12345678',
      nombre: 'Juan',
      apellidos: 'Perez',
      fechaNacimiento: '1995-05-15',
      sexo: 'M',
      telefono: '947784188',
      tipoSeguro: 'TITULAR',
      grupoSanguineo: 'O+',
    };

    // 1. Ejecutar el servicio con rol administrativo
    await pacienteService.ejecutar(dto, ROL_ADMINISTRATIVO);

    // 2. Verificar persistencia real en la tabla MySQL 'pacientes'
    const pacienteEnBd = await dataSource.getRepository(PacienteModel).findOne({ where: { dni: '12345678' } });

    expect(pacienteEnBd).not.toBeNull();
    expect(pacienteEnBd?.dni).toBe('12345678');
    expect(pacienteEnBd?.nombre).toBe('Juan');
    expect(pacienteEnBd?.apellidos).toBe('Perez');
    expect(pacienteEnBd?.telefono).toBe('947784188');
    expect(pacienteEnBd?.tipoSeguro).toBe('TITULAR');
    expect(pacienteEnBd?.grupoSanguineo).toBe('O+');
  });

  // =========================================================
  // CASO INTEGRACIÓN 2: Excepción por DNI de más de 8 dígitos
  // =========================================================
  it('ID 2 (Integración): Rechazar registro si el DNI sobrepasa 8 dígitos y asegurar no persistencia', async () => {
    const dto: CreatePacienteDTO = {
      dni: '100000000', // 9 dígitos
      nombre: 'Juan',
      apellidos: 'Perez',
      fechaNacimiento: '1995-05-15',
      sexo: 'M',
      telefono: '947784188',
      tipoSeguro: 'TITULAR',
      grupoSanguineo: 'O+',
    };

    // 1. Validar la excepción
    await expect(pacienteService.ejecutar(dto, ROL_ADMINISTRATIVO)).rejects.toThrow(
      'El DNI debe contener exactamente 8 dígitos numéricos.'
    );

    // 2. Verificar que NO se haya insertado en la BD
    const pacienteEnBd = await dataSource.getRepository(PacienteModel).findOne({ where: { dni: '100000000' } });
    expect(pacienteEnBd).toBeNull();
  });

  // =========================================================
  // CASO INTEGRACIÓN 3: Excepción por Nombre con Números
  // =========================================================
  it('ID 3 (Integración): Rechazar registro si el nombre contiene números y asegurar no persistencia', async () => {
    const dto: CreatePacienteDTO = {
      dni: '12345678',
      nombre: 'Juan123', // Inválido
      apellidos: 'Perez',
      fechaNacimiento: '1995-05-15',
      sexo: 'M',
      telefono: '947784188',
      tipoSeguro: 'TITULAR',
      grupoSanguineo: 'O+',
    };

    // 1. Validar la excepción
    await expect(pacienteService.ejecutar(dto, ROL_ADMINISTRATIVO)).rejects.toThrow(
      'El nombre debe contener únicamente letras.'
    );

    // 2. Verificar que NO se haya insertado en la BD
    const pacienteEnBd = await dataSource.getRepository(PacienteModel).findOne({ where: { dni: '12345678' } });
    expect(pacienteEnBd).toBeNull();
  });
});