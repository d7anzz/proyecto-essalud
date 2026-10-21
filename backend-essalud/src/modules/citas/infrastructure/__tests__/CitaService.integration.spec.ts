import { DataSource } from 'typeorm';
import { MysqlCitaRepository } from '../MysqlCitaRepository';
import { MysqlHorarioRepository } from '../../../registro-horario/infrastructure/MysqlHorarioRepository';
import { MysqlPacienteRepository } from '../../../pacientes/infrastructure/MysqlPacienteRepository';
import { CitaModel } from '../CitaModel';
import { HorarioModel } from '../../../registro-horario/infrastructure/HorarioModel';
import { PacienteModel } from '../../../pacientes/infrastructure/PacienteModel';
import { PersonalModel, EspecialidadInline } from '../../../registropersonal/infrastructure/PersonalModel';
import { UsuarioModel } from '../../../login/infrastructure/UsuarioModel';
import { CitaService } from '../../application/CitaService';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('Pruebas de Integración: Módulo Registro de Citas (Casos ID 12 al 14)', () => {
  let dataSource: DataSource;
  let citaService: CitaService;

  const ROL_ADMINISTRATIVO = 2;
  const ROL_MEDICO = 1;
  const DNI_MEDICO_PRUEBA = '44445555';
  const DNI_PACIENTE_REGISTRADO = '12345678';
  const DNI_PACIENTE_NO_REGISTRADO = '00000000';

  let idSlotLibre: number;
  let idSlotOcupado: number;

  const obtenerFechaRelativa = (dias: number): string => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0]!;
  };

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Darikson1905@',
      database: process.env.DB_NAME || 'essalud_db',
      entities: [CitaModel, HorarioModel, PacienteModel, PersonalModel, UsuarioModel, EspecialidadInline],
      synchronize: false,
      logging: false,
    });

    await dataSource.initialize();

    const citaRepo = new MysqlCitaRepository(dataSource);
    const horarioRepo = new MysqlHorarioRepository(dataSource);
    const pacienteOrmRepo = dataSource.getRepository(PacienteModel);
    const pacienteRepo = new MysqlPacienteRepository(pacienteOrmRepo);

    citaService = new CitaService(citaRepo, horarioRepo, pacienteRepo as any);

    const usuarioRepo = dataSource.getRepository(UsuarioModel);
    const personalRepo = dataSource.getRepository(PersonalModel);
    const pacienteRepoOrm = dataSource.getRepository(PacienteModel);

    // Asegurar Usuario Médico
    let usuarioExistente = await usuarioRepo.findOneBy({ dni: DNI_MEDICO_PRUEBA });
    if (!usuarioExistente) {
      await usuarioRepo.save({
        dni: DNI_MEDICO_PRUEBA,
        username: 'medico_citas_test',
        passwordHash: '$2a$10$hashdeprueba',
        password_hash: '$2a$10$hashdeprueba',
        password: '$2a$10$hashdeprueba',
        idRol: ROL_MEDICO,
        intentosFallidos: 0,
        primerAcceso: false,
        activo: true
      } as any);
    }

    // Asegurar Personal Médico
    let personalExistente = await personalRepo.findOneBy({ dni: DNI_MEDICO_PRUEBA });
    if (!personalExistente) {
      await personalRepo.save({
        dni: DNI_MEDICO_PRUEBA,
        nombre: 'Carlos',
        apellidos: 'Mendoza',
        fec_nac: '1985-05-15',
        fecNac: '1985-05-15',
        fechaNacimiento: '1985-05-15',
        colegiatura: '54321',
        telefono: '987654321',
        idEspecialidad: 1,
        id_especialidad: 1
      } as any);
    }

    // Asegurar Paciente Registrado
    let pacienteExistente = await pacienteRepoOrm.findOneBy({ dni: DNI_PACIENTE_REGISTRADO });
    if (!pacienteExistente) {
      await pacienteRepoOrm.save({
        dni: DNI_PACIENTE_REGISTRADO,
        nombre: 'Juan',
        apellidos: 'Pérez',
        fechaNacimiento: '1990-05-15',
        sexo: 'M',
        telefono: '987654321',
        tipoSeguro: 'TITULAR',
        grupoSanguineo: 'O+'
      } as any);
    }
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      const citaRepoOrm = dataSource.getRepository(CitaModel);
      const horarioRepoOrm = dataSource.getRepository(HorarioModel);

      await citaRepoOrm.delete({ dniPaciente: DNI_PACIENTE_REGISTRADO });
      await horarioRepoOrm.delete({ dni: DNI_MEDICO_PRUEBA });
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      const citaRepoOrm = dataSource.getRepository(CitaModel);
      const horarioRepoOrm = dataSource.getRepository(HorarioModel);

      await citaRepoOrm.delete({ dniPaciente: DNI_PACIENTE_REGISTRADO });
      await horarioRepoOrm.delete({ dni: DNI_MEDICO_PRUEBA });

      const fechaMas3Dias = obtenerFechaRelativa(3);

      // Slot Libre: Usar 1 o 'DISPONIBLE' según compatibilidad de TypeORM
      const slotLibre = await horarioRepoOrm.save({
        dni: DNI_MEDICO_PRUEBA,
        fecha: fechaMas3Dias,
        horaInicio: '08:00',
        horaFin: '08:30',
        turno: 'MAÑANA',
        estado: 1 as any
      } as any);
      idSlotLibre = (slotLibre as any).id || (slotLibre as any).idHorario;

      // Slot Ocupado: Usar 0
      const slotOcupado = await horarioRepoOrm.save({
        dni: DNI_MEDICO_PRUEBA,
        fecha: fechaMas3Dias,
        horaInicio: '08:30',
        horaFin: '09:00',
        turno: 'MAÑANA',
        estado: 0 as any
      } as any);
      idSlotOcupado = (slotOcupado as any).id || (slotOcupado as any).idHorario;
    }
  });

  afterEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      const citaRepoOrm = dataSource.getRepository(CitaModel);
      const horarioRepoOrm = dataSource.getRepository(HorarioModel);

      await citaRepoOrm.delete({ dniPaciente: DNI_PACIENTE_REGISTRADO });
      await horarioRepoOrm.delete({ dni: DNI_MEDICO_PRUEBA });
    }
  });

  // =========================================================
  // CASO INTEGRACIÓN 12: Registro Exitoso
  // =========================================================
  it('ID 12 (Integración): Confirmar reserva con paciente registrado, médico y slot libre', async () => {
    const dto = {
      dniPaciente: DNI_PACIENTE_REGISTRADO,
      dniMedico: DNI_MEDICO_PRUEBA,
      idEspecialidad: 1,
      idHorario: idSlotLibre
    };

    const citaCreada = await citaService.crear(dto, ROL_ADMINISTRATIVO);

    expect(citaCreada).not.toBeNull();
    expect(citaCreada.dniPaciente).toBe(DNI_PACIENTE_REGISTRADO);

    const horarioEnBD = await dataSource.getRepository(HorarioModel).findOne({
      where: { id: idSlotLibre } as any
    });
    expect(Number((horarioEnBD as any)?.estado) === 0 || (horarioEnBD as any)?.estado === 'OCUPADO').toBe(true);
  });

  // =========================================================
  // CASO INTEGRACIÓN 13: Slot Ocupado
  // =========================================================
  it('ID 13 (Integración): Rechazar reserva cuando el horario seleccionado se encuentra ocupado', async () => {
    const dto = {
      dniPaciente: DNI_PACIENTE_REGISTRADO,
      dniMedico: DNI_MEDICO_PRUEBA,
      idEspecialidad: 1,
      idHorario: idSlotOcupado
    };

    await expect(citaService.crear(dto, ROL_ADMINISTRATIVO)).rejects.toThrow(
      'Horario inválido'
    );
  });

  // =========================================================
  // CASO INTEGRACIÓN 14: Paciente No Registrado
  // =========================================================
  it('ID 14 (Integración): Rechazar reserva cuando el DNI del paciente no está en la base de datos', async () => {
    const dto = {
      dniPaciente: DNI_PACIENTE_NO_REGISTRADO,
      dniMedico: DNI_MEDICO_PRUEBA,
      idEspecialidad: 1,
      idHorario: idSlotLibre
    };

    await expect(citaService.crear(dto, ROL_ADMINISTRATIVO)).rejects.toThrow(
      'Paciente no registrado'
    );
  });
});