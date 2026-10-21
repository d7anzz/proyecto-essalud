import { DataSource } from 'typeorm';
import { MysqlPersonalRepository } from '../MysqlPersonaRepository';
// IMPORTANTE: Se importa EspecialidadInline que está dentro de PersonalModel.ts
import { PersonalModel, EspecialidadInline } from '../PersonalModel';
import { UsuarioModel } from '../../../login/infrastructure/UsuarioModel';
import { RegistrarPersonalService } from '../../application/RegistrarPersonalService';
import { RegistrarPersonalDTO } from '../../application/RegistrarPersonalDTO';
import dotenv from 'dotenv';

dotenv.config();

describe('Pruebas de Integración: Módulo de Personal de Salud (Casos ID 4 al 7)', () => {
  let dataSource: DataSource;
  let personalRepository: MysqlPersonalRepository;
  let registrarPersonalService: RegistrarPersonalService;

  const ROL_JEFE_HOSPITAL = 4; // Rol autorizado para ejecutar el registro

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Darikson1905@',
      database: process.env.DB_NAME || 'essalud_db',
      // Se agregan las 3 entidades necesarias para resolver las relaciones de TypeORM
      entities: [PersonalModel, UsuarioModel, EspecialidadInline],
      synchronize: false,
      logging: false,
    });

    await dataSource.initialize();

    personalRepository = new MysqlPersonalRepository(dataSource);
    registrarPersonalService = new RegistrarPersonalService(personalRepository);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    // Limpieza de datos de prueba antes de cada test para garantizar aislamiento
    const personalRepo = dataSource.getRepository(PersonalModel);
    const usuarioRepo = dataSource.getRepository(UsuarioModel);

    await personalRepo.delete({ dni: '87654321' });
    await usuarioRepo.delete({ dni: '87654321' });
  });

  afterEach(async () => {
    // Limpieza de datos creados tras finalizar cada prueba
    const personalRepo = dataSource.getRepository(PersonalModel);
    const usuarioRepo = dataSource.getRepository(UsuarioModel);

    await personalRepo.delete({ dni: '87654321' });
    await usuarioRepo.delete({ dni: '87654321' });
  });

  // =========================================================
  // CASO INTEGRACIÓN 4: Registro Exitoso de Médico
  // =========================================================
  it('ID 4 (Integración): Registrar médico exitosamente con datos válidos y verificar persistencia en BD', async () => {
    const dto: RegistrarPersonalDTO = {
      dni: '87654321',
      username: 'medico_carlos',
      nombre: 'Carlos',
      apellidos: 'Gomez',
      fecNac: '1985-10-10',
      idRol: 1, // Médico
      idEspecialidad: 1,
      colegiatura: '12345',
      telefono: '999999999'
    };

    // 1. Ejecutar el servicio
    await registrarPersonalService.ejecutar(dto, ROL_JEFE_HOSPITAL);

    // 2. Verificar persistencia en la tabla personal_salud
    const personalEnBd = await dataSource.getRepository(PersonalModel).findOne({ where: { dni: '87654321' } });
    expect(personalEnBd).not.toBeNull();
    expect(personalEnBd?.dni).toBe('87654321');
    expect(personalEnBd?.nombre).toBe('Carlos');
    expect(personalEnBd?.apellidos).toBe('Gomez');
    expect(personalEnBd?.colegiatura).toBe('12345');
    expect(personalEnBd?.telefono).toBe('999999999');

    // 3. Verificar persistencia de credenciales en la tabla usuarios
    const usuarioEnBd = await dataSource.getRepository(UsuarioModel).findOne({ where: { dni: '87654321' } });
    expect(usuarioEnBd).not.toBeNull();
    expect(usuarioEnBd?.dni).toBe('87654321');
  });

  // =========================================================
  // CASO INTEGRACIÓN 5: Registro Exitoso de Administrativo
  // =========================================================
  it('ID 5 (Integración): Registrar personal administrativo exitosamente sin especialidad ni colegiatura', async () => {
    const dto: RegistrarPersonalDTO = {
      dni: '87654321',
      username: 'admin_carlos',
      nombre: 'Carlos',
      apellidos: 'Gomez',
      fecNac: '1985-10-10',
      idRol: 2, // Administrativo
      idEspecialidad: null,
      colegiatura: null,
      telefono: '999999999'
    };

    // 1. Ejecutar el servicio
    await registrarPersonalService.ejecutar(dto, ROL_JEFE_HOSPITAL);

    // 2. Verificar persistencia en la tabla personal_salud
    const personalEnBd = await dataSource.getRepository(PersonalModel).findOne({ where: { dni: '87654321' } });
    expect(personalEnBd).not.toBeNull();
    expect(personalEnBd?.dni).toBe('87654321');
    expect(personalEnBd?.colegiatura).toBeNull();
    expect(personalEnBd?.idEspecialidad).toBeNull();

    // 3. Verificar credenciales asociadas
    const usuarioEnBd = await dataSource.getRepository(UsuarioModel).findOne({ where: { dni: '87654321' } });
    expect(usuarioEnBd).not.toBeNull();
  });

  // =========================================================
  // CASO INTEGRACIÓN 6: Colegiatura Inválida (4 dígitos)
  // =========================================================
  it('ID 6 (Integración): Rechazar registro si la colegiatura tiene menos de 5 dígitos y asegurar no persistencia', async () => {
    const dto: RegistrarPersonalDTO = {
      dni: '87654321',
      username: 'medico_carlos',
      nombre: 'Carlos',
      apellidos: 'Gomez',
      fecNac: '1985-10-10',
      idRol: 1, // Médico
      idEspecialidad: 1,
      colegiatura: '1234', // Inválido (4 dígitos)
      telefono: '999999999'
    };

    // 1. Evaluar llamada directa al servicio
    await expect(registrarPersonalService.ejecutar(dto, ROL_JEFE_HOSPITAL)).rejects.toThrow(
      'La colegiatura debe tener entre 5 y 6 dígitos'
    );

    // 2. Asegurar no persistencia en la BD
    const personalEnBd = await dataSource.getRepository(PersonalModel).findOne({ where: { dni: '87654321' } });
    expect(personalEnBd).toBeNull();
  });

  // =========================================================
  // CASO INTEGRACIÓN 7: Teléfono Inválido (8 dígitos)
  // =========================================================
  it('ID 7 (Integración): Rechazar registro si el teléfono no tiene 9 dígitos y asegurar no persistencia', async () => {
    const dto: RegistrarPersonalDTO = {
      dni: '87654321',
      username: 'medico_carlos',
      nombre: 'Carlos',
      apellidos: 'Gomez',
      fecNac: '1985-10-10',
      idRol: 1, // Médico
      idEspecialidad: 1,
      colegiatura: '12345',
      telefono: '99999999' // Inválido (8 dígitos)
    };

    // 1. Evaluar llamada directa al servicio
    await expect(registrarPersonalService.ejecutar(dto, ROL_JEFE_HOSPITAL)).rejects.toThrow(
      'El número de teléfono debe tener 9 dígitos'
    );

    // 2. Asegurar no persistencia en la BD
    const personalEnBd = await dataSource.getRepository(PersonalModel).findOne({ where: { dni: '87654321' } });
    expect(personalEnBd).toBeNull();
  });
});