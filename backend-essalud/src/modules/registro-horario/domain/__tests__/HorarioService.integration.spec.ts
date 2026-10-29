import { DataSource } from 'typeorm';
import { MysqlHorarioRepository } from '../../infrastructure/MysqlHorarioRepository';
import { HorarioModel } from '../../infrastructure/HorarioModel';
import { PersonalModel, EspecialidadInline } from '../../../registropersonal/infrastructure/PersonalModel';
import { UsuarioModel } from '../../../login/infrastructure/UsuarioModel';
import { CitaModel } from '../../../citas/infrastructure/CitaModel';
import { PacienteModel } from '../../../pacientes/infrastructure/PacienteModel'; // 👈 Se importa PacienteModel
import { HorarioService } from '../../application/HorarioService';
import { CrearHorarioDTO } from '../../application/CrearHorarioDTO';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env'), quiet: true });

describe('Pruebas de Integración: Módulo de Registro de Horarios (Casos ID 8 al 11)', () => {
  let dataSource: DataSource;
  let horarioRepository: MysqlHorarioRepository;
  let horarioService: HorarioService;

  const ROL_MEDICO = 1;
  const DNI_MEDICO_PRUEBA = '87654321';

  const obtenerFechaRelativa = (dias: number): string => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0]!;
  };

  const limpiarTablas = async () => {
    if (dataSource && dataSource.isInitialized) {
      const citaRepo = dataSource.getRepository(CitaModel);
      const horarioRepo = dataSource.getRepository(HorarioModel);

      await citaRepo.delete({ idMedico: DNI_MEDICO_PRUEBA });
      await horarioRepo.delete({ dni: DNI_MEDICO_PRUEBA });
    }
  };

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Darikson1905@',
      database: process.env.DB_NAME || 'essalud_db',
      // 👈 Se agrega PacienteModel en la lista de entidades
      entities: [HorarioModel, PersonalModel, UsuarioModel, EspecialidadInline, CitaModel, PacienteModel],
      synchronize: false,
      logging: false,
    });

    await dataSource.initialize();

    horarioRepository = new MysqlHorarioRepository(dataSource);
    horarioService = new HorarioService(horarioRepository);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await limpiarTablas();
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    await limpiarTablas();

    const usuarioRepo = dataSource.getRepository(UsuarioModel);
    const personalRepo = dataSource.getRepository(PersonalModel);

    let usuarioExistente = await usuarioRepo.findOneBy({ dni: DNI_MEDICO_PRUEBA });
    if (!usuarioExistente) {
      await usuarioRepo.save({
        dni: DNI_MEDICO_PRUEBA,
        username: 'medico_horarios_test',
        passwordHash: '$2a$10$hashdeprueba',
        password_hash: '$2a$10$hashdeprueba',
        password: '$2a$10$hashdeprueba',
        idRol: ROL_MEDICO,
        intentosFallidos: 0,
        primerAcceso: false,
        activo: true
      } as any);
    }

    let personalExistente = await personalRepo.findOneBy({ dni: DNI_MEDICO_PRUEBA });
    if (!personalExistente) {
      await personalRepo.save({
        dni: DNI_MEDICO_PRUEBA,
        nombre: 'Medico',
        apellidos: 'Prueba',
        fec_nac: '1985-05-15',
        fecNac: '1985-05-15',
        fechaNacimiento: '1985-05-15',
        colegiatura: '12345',
        telefono: '987654321',
        idEspecialidad: 1,
        id_especialidad: 1
      } as any);
    }
  });

  afterEach(async () => {
    await limpiarTablas();
  });

  it('ID 8 (Integración): Registrar horario exitosamente (Hoy+4días, Mañana, 07:00-13:00) y verificar en BD', async () => {
    const fechaValida = obtenerFechaRelativa(4);

    const dto: CrearHorarioDTO = {
      dni: DNI_MEDICO_PRUEBA,
      fecha: fechaValida,
      turno: 'MAÑANA',
      horaInicio: '07:00',
      cantidadPacientes: 10
    };

    const horarioCreado = await horarioService.crear(dto, ROL_MEDICO);

    expect(horarioCreado).not.toBeNull();
    expect(horarioCreado.dni).toBe(DNI_MEDICO_PRUEBA);

    const horarioEnBd = await dataSource.getRepository(HorarioModel).findOne({
      where: { dni: DNI_MEDICO_PRUEBA, fecha: fechaValida }
    });

    expect(horarioEnBd).not.toBeNull();
    expect(horarioEnBd?.turno).toBe('MAÑANA');
  });

  it('ID 9 (Integración): Evaluar registro con datos de horario y verificar persistencia en BD', async () => {
    const fechaValida = obtenerFechaRelativa(4);

    const dto: CrearHorarioDTO = {
      dni: DNI_MEDICO_PRUEBA,
      fecha: fechaValida,
      turno: 'MAÑANA',
      horaInicio: '07:00',
      cantidadPacientes: 1
    };

    const resultado = await horarioService.crear(dto, ROL_MEDICO);
    expect(resultado).not.toBeNull();

    const horarioEnBd = await dataSource.getRepository(HorarioModel).findOne({
      where: { dni: DNI_MEDICO_PRUEBA, fecha: fechaValida }
    });
    expect(horarioEnBd).not.toBeNull();
  });

  it('ID 10 (Integración): Rechazar si la cantidad de pacientes sobrepasa el turno asignado', async () => {
    const fechaValida = obtenerFechaRelativa(4);

    const dto: CrearHorarioDTO = {
      dni: DNI_MEDICO_PRUEBA,
      fecha: fechaValida,
      turno: 'TARDE',
      horaInicio: '13:00',
      cantidadPacientes: 20
    };

    await expect(horarioService.crear(dto, ROL_MEDICO)).rejects.toThrow(
      'Exceso de Capacidad'
    );
  });

  it('ID 11 (Integración): Rechazar si el tiempo total excede el límite del turno Mañana', async () => {
    const fechaValida = obtenerFechaRelativa(5);

    const dto: CrearHorarioDTO = {
      dni: DNI_MEDICO_PRUEBA,
      fecha: fechaValida,
      turno: 'MAÑANA',
      horaInicio: '08:00',
      cantidadPacientes: 15
    };

    await expect(horarioService.crear(dto, ROL_MEDICO)).rejects.toThrow(
      'Exceso de Capacidad'
    );
  });
});