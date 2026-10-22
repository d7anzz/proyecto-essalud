import { DataSource, MoreThan } from 'typeorm';
import { MysqlConsultaRepository } from '../MysqlConsultaRepository';
import { MysqlCitaRepository } from '../../../citas/infrastructure/MysqlCitaRepository';
import { ConsultaService } from '../../application/ConsultaService';
import { ConsultaModel } from '../ConsultaModel';
import { CitaModel } from '../../../citas/infrastructure/CitaModel';
import { HorarioModel } from '../../../registro-horario/infrastructure/HorarioModel';
import { PacienteModel } from '../../../pacientes/infrastructure/PacienteModel';
import { PersonalModel, EspecialidadInline } from '../../../registropersonal/infrastructure/PersonalModel';
import { UsuarioModel } from '../../../login/infrastructure/UsuarioModel';
import { MedicamentoModel } from '../../../farmacia/infrastructure/MedicamentoModel';
import { OrdenMedicamentoModel } from '../../../farmacia/infrastructure/OrdenMedicamentoModel';
import { CrearConsultaDTO } from '../../application/CrearConsultaDTO';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('Pruebas de Integración: Módulo Consulta Médica (Casos ID 15 al 18)', () => {
  let dataSource: DataSource;
  let consultaService: ConsultaService;

  const ROL_MEDICO = 1;
  const DNI_MEDICO_PRUEBA = '87654321';
  const DNI_PACIENTE_PRUEBA = '12345678';
  const ID_MEDICAMENTO_PARACETAMOL = 1;

  let idCitaPendiente: number;
  let idCitaCompletada: number;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Darikson1905@',
      database: process.env.DB_NAME || 'essalud_db',
      entities: [
        ConsultaModel,
        CitaModel,
        HorarioModel,
        PacienteModel,
        PersonalModel,
        UsuarioModel,
        EspecialidadInline,
        MedicamentoModel,
        OrdenMedicamentoModel
      ],
      synchronize: false,
      logging: false,
    });

    await dataSource.initialize();

    const consultaRepo = new MysqlConsultaRepository(dataSource);
    const citaRepo = new MysqlCitaRepository(dataSource);

    consultaService = new ConsultaService(consultaRepo, citaRepo);

    const usuarioRepo = dataSource.getRepository(UsuarioModel);
    const personalRepo = dataSource.getRepository(PersonalModel);
    const pacienteRepo = dataSource.getRepository(PacienteModel);
    const medicamentoRepo = dataSource.getRepository(MedicamentoModel);

    let usuarioExistente = await usuarioRepo.findOneBy({ dni: DNI_MEDICO_PRUEBA });
    if (!usuarioExistente) {
      await usuarioRepo.save({
        dni: DNI_MEDICO_PRUEBA,
        username: 'medico_consulta_test',
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

    let pacienteExistente = await pacienteRepo.findOneBy({ dni: DNI_PACIENTE_PRUEBA });
    if (!pacienteExistente) {
      await pacienteRepo.save({
        dni: DNI_PACIENTE_PRUEBA,
        nombre: 'Juan',
        apellidos: 'Pérez',
        fechaNacimiento: '1990-05-15',
        sexo: 'M',
        telefono: '987654321',
        tipoSeguro: 'TITULAR',
        grupoSanguineo: 'O+'
      } as any);
    }

    let medicamentoExistente = await medicamentoRepo.findOneBy({ idMedicamento: ID_MEDICAMENTO_PARACETAMOL });
    if (!medicamentoExistente) {
      await medicamentoRepo.save({
        idMedicamento: ID_MEDICAMENTO_PARACETAMOL,
        nombre: 'Paracetamol 500mg',
        nombreMedicamento: 'Paracetamol 500mg',
        nombre_medicamento: 'Paracetamol 500mg',
        fechaVencimiento: '2028-12-31',
        fecha_vencimiento: '2028-12-31',
        stock: 500
      } as any);
    }
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      const ordenRepo = dataSource.getRepository(OrdenMedicamentoModel);
      const consultaRepo = dataSource.getRepository(ConsultaModel);
      const citaRepo = dataSource.getRepository(CitaModel);
      const horarioRepo = dataSource.getRepository(HorarioModel);

      await ordenRepo.delete({ idConsulta: MoreThan(0) });
      await consultaRepo.delete({ idConsulta: MoreThan(0) });
      await citaRepo.delete({ dniPaciente: DNI_PACIENTE_PRUEBA });
      await horarioRepo.delete({ dni: DNI_MEDICO_PRUEBA });

      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      const ordenRepo = dataSource.getRepository(OrdenMedicamentoModel);
      const consultaRepo = dataSource.getRepository(ConsultaModel);
      const citaRepo = dataSource.getRepository(CitaModel);
      const horarioRepo = dataSource.getRepository(HorarioModel);

      await ordenRepo.delete({ idConsulta: MoreThan(0) });
      await consultaRepo.delete({ idConsulta: MoreThan(0) });
      await citaRepo.delete({ dniPaciente: DNI_PACIENTE_PRUEBA });
      await horarioRepo.delete({ dni: DNI_MEDICO_PRUEBA });

      const horario1 = await horarioRepo.save({
        dni: DNI_MEDICO_PRUEBA,
        fecha: '2026-11-01',
        horaInicio: '08:00',
        horaFin: '08:30',
        turno: 'MAÑANA',
        estado: 1 as any
      } as any);

      const horario2 = await horarioRepo.save({
        dni: DNI_MEDICO_PRUEBA,
        fecha: '2026-11-01',
        horaInicio: '08:30',
        horaFin: '09:00',
        turno: 'MAÑANA',
        estado: 1 as any
      } as any);

      const idH1 = (horario1 as any).id || (horario1 as any).idHorario;
      const idH2 = (horario2 as any).id || (horario2 as any).idHorario;

      const citaPendiente = await citaRepo.save({
        dniPaciente: DNI_PACIENTE_PRUEBA,
        idMedico: DNI_MEDICO_PRUEBA,
        idHorario: idH1,
        estado: 'PENDIENTE'
      } as any);
      idCitaPendiente = citaPendiente.idCita;

      const citaCompletada = await citaRepo.save({
        dniPaciente: DNI_PACIENTE_PRUEBA,
        idMedico: DNI_MEDICO_PRUEBA,
        idHorario: idH2,
        estado: 'COMPLETADA'
      } as any);
      idCitaCompletada = citaCompletada.idCita;
    }
  });

  afterEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      const ordenRepo = dataSource.getRepository(OrdenMedicamentoModel);
      const consultaRepo = dataSource.getRepository(ConsultaModel);
      const citaRepo = dataSource.getRepository(CitaModel);
      const horarioRepo = dataSource.getRepository(HorarioModel);

      await ordenRepo.delete({ idConsulta: MoreThan(0) });
      await consultaRepo.delete({ idConsulta: MoreThan(0) });
      await citaRepo.delete({ dniPaciente: DNI_PACIENTE_PRUEBA });
      await horarioRepo.delete({ dni: DNI_MEDICO_PRUEBA });
    }
  });

  it('ID 15 (Integración): Registrar consulta exitosamente, cambiar cita a COMPLETADA y enviar orden a farmacia', async () => {
    const dto: CrearConsultaDTO = {
      idCita: idCitaPendiente,
      dniPaciente: DNI_PACIENTE_PRUEBA,
      idMedico: DNI_MEDICO_PRUEBA,
      diagnostico: 'Paciente presenta cuadro febril y tos',
      observaciones: 'Reposo por 48 horas',
      medicamentos: [
        { idMedicamento: ID_MEDICAMENTO_PARACETAMOL, cantidadRecetada: 1 }
      ]
    };

    await consultaService.crearConsultaMedica(dto, ROL_MEDICO);

    const consultaEnBD = await dataSource.getRepository(ConsultaModel).findOne({
      where: { idCita: idCitaPendiente }
    });
    expect(consultaEnBD).not.toBeNull();
    expect(consultaEnBD?.diagnostico).toBe('Paciente presenta cuadro febril y tos');

    const citaEnBD = await dataSource.getRepository(CitaModel).findOne({
      where: { idCita: idCitaPendiente }
    });
    expect(citaEnBD?.estado).toBe('COMPLETADA');

    const ordenEnBD = await dataSource.getRepository(OrdenMedicamentoModel).findOne({
      where: { idConsulta: consultaEnBD?.idConsulta }
    });
    expect(ordenEnBD).not.toBeNull();
    expect(ordenEnBD?.cantidadRecetada).toBe(1);
  });

  it('ID 16 (Integración): Rechazar atención si la cita ya ha sido completada previamente', async () => {
    const dto: CrearConsultaDTO = {
      idCita: idCitaCompletada,
      dniPaciente: DNI_PACIENTE_PRUEBA,
      idMedico: DNI_MEDICO_PRUEBA,
      diagnostico: 'Paciente evoluciona favorablemente',
      observaciones: 'Reposo',
      medicamentos: [
        { idMedicamento: ID_MEDICAMENTO_PARACETAMOL, cantidadRecetada: 1 }
      ]
    };

    await expect(consultaService.crearConsultaMedica(dto, ROL_MEDICO)).rejects.toThrow(
      'La cita ya ha sido atendida previamente'
    );
  });

  it('ID 17 (Integración): Rechazar consulta si el diagnóstico no tiene entre 5 y 1000 caracteres', async () => {
    const dto: CrearConsultaDTO = {
      idCita: idCitaPendiente,
      dniPaciente: DNI_PACIENTE_PRUEBA,
      idMedico: DNI_MEDICO_PRUEBA,
      diagnostico: 'grip',
      observaciones: 'Reposo',
      medicamentos: [
        { idMedicamento: ID_MEDICAMENTO_PARACETAMOL, cantidadRecetada: 1 }
      ]
    };

    await expect(consultaService.crearConsultaMedica(dto, ROL_MEDICO)).rejects.toThrow(
      'El diagnóstico debe tener entre 5 y 1000 caracteres'
    );
  });

  it('ID 18 (Integración): Rechazar consulta si la cantidad recetada excede las 100 unidades', async () => {
    const dto: CrearConsultaDTO = {
      idCita: idCitaPendiente,
      dniPaciente: DNI_PACIENTE_PRUEBA,
      idMedico: DNI_MEDICO_PRUEBA,
      diagnostico: 'Paciente presenta dolor articular',
      observaciones: 'Reposo',
      medicamentos: [
        { idMedicamento: ID_MEDICAMENTO_PARACETAMOL, cantidadRecetada: 101 }
      ]
    };

    await expect(consultaService.crearConsultaMedica(dto, ROL_MEDICO)).rejects.toThrow(
      'El máximo recetable es de 100 unidades'
    );
  });
});