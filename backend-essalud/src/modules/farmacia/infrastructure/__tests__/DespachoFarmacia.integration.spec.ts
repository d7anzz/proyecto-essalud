import { DataSource, MoreThan } from 'typeorm';
import { MysqlFarmaciaRepository } from '../MysqlFarmaciaRepository';
import { FarmaciaService } from '../../application/FarmaciaService';
import { MedicamentoModel } from '../MedicamentoModel';
import { OrdenMedicamentoModel } from '../OrdenMedicamentoModel';
import { ConsultaModel } from '../../../diagnosticos/infrastructure/ConsultaModel';
import { CitaModel } from '../../../citas/infrastructure/CitaModel';
import { HorarioModel } from '../../../registro-horario/infrastructure/HorarioModel';
import { PacienteModel } from '../../../pacientes/infrastructure/PacienteModel';
import { PersonalModel, EspecialidadInline } from '../../../registropersonal/infrastructure/PersonalModel';
import { UsuarioModel } from '../../../login/infrastructure/UsuarioModel';
import { DespacharRecetaDTO } from '../../application/DespacharRecetaDTO';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('Pruebas de Integración: Módulo Despacho de Farmacia (Casos ID 23 al 26)', () => {
  let dataSource: DataSource;
  let farmaciaService: FarmaciaService;

  const ROL_FARMACEUTICO = 3;
  const DNI_MEDICO_PRUEBA = '87654321';
  const DNI_PACIENTE_PRUEBA = '12345678';

  let idConsultaPrueba: number;
  let idMedicamentoPrueba: number;
  let idOrdenPendiente: number;
  let idOrdenAtendida: number;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Darikson1905@',
      database: process.env.DB_NAME || 'essalud_db',
      entities: [
        MedicamentoModel,
        OrdenMedicamentoModel,
        ConsultaModel,
        CitaModel,
        HorarioModel,
        PacienteModel,
        PersonalModel,
        UsuarioModel,
        EspecialidadInline
      ],
      synchronize: false,
      logging: false,
    });

    await dataSource.initialize();

    const farmaciaRepo = new MysqlFarmaciaRepository(dataSource);
    farmaciaService = new FarmaciaService(farmaciaRepo);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      const ordenRepo = dataSource.getRepository(OrdenMedicamentoModel);
      const consultaRepo = dataSource.getRepository(ConsultaModel);
      const citaRepo = dataSource.getRepository(CitaModel);
      const horarioRepo = dataSource.getRepository(HorarioModel);
      const medRepo = dataSource.getRepository(MedicamentoModel);

      await ordenRepo.delete({ idOrden: MoreThan(0) });
      await consultaRepo.delete({ idConsulta: MoreThan(0) });
      await citaRepo.delete({ dniPaciente: DNI_PACIENTE_PRUEBA });
      await horarioRepo.delete({ dni: DNI_MEDICO_PRUEBA });
      await medRepo.delete({ idMedicamento: MoreThan(0) });

      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      const ordenRepo = dataSource.getRepository(OrdenMedicamentoModel);
      const consultaRepo = dataSource.getRepository(ConsultaModel);
      const citaRepo = dataSource.getRepository(CitaModel);
      const horarioRepo = dataSource.getRepository(HorarioModel);
      const medRepo = dataSource.getRepository(MedicamentoModel);
      const usuarioRepo = dataSource.getRepository(UsuarioModel);
      const personalRepo = dataSource.getRepository(PersonalModel);
      const pacienteRepo = dataSource.getRepository(PacienteModel);

      await ordenRepo.delete({ idOrden: MoreThan(0) });
      await consultaRepo.delete({ idConsulta: MoreThan(0) });
      await citaRepo.delete({ dniPaciente: DNI_PACIENTE_PRUEBA });
      await horarioRepo.delete({ dni: DNI_MEDICO_PRUEBA });
      await medRepo.delete({ idMedicamento: MoreThan(0) });

      let usuarioExistente = await usuarioRepo.findOneBy({ dni: DNI_MEDICO_PRUEBA });
      if (!usuarioExistente) {
        await usuarioRepo.save({
          dni: DNI_MEDICO_PRUEBA,
          username: 'medico_despacho_test',
          passwordHash: '$2a$10$hashdeprueba',
          password_hash: '$2a$10$hashdeprueba',
          password: '$2a$10$hashdeprueba',
          idRol: 1,
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

      const horario = await horarioRepo.save({
        dni: DNI_MEDICO_PRUEBA,
        fecha: '2026-11-01',
        horaInicio: '08:00',
        horaFin: '08:30',
        turno: 'MAÑANA',
        estado: 1 as any
      } as any);
      const idHorarioReal = (horario as any).id || (horario as any).idHorario;

      const cita = await citaRepo.save({
        dniPaciente: DNI_PACIENTE_PRUEBA,
        idMedico: DNI_MEDICO_PRUEBA,
        idHorario: idHorarioReal,
        estado: 'COMPLETADA'
      } as any);

      const consulta = await consultaRepo.save({
        idCita: cita.idCita,
        dniPaciente: DNI_PACIENTE_PRUEBA,
        idMedico: DNI_MEDICO_PRUEBA,
        diagnostico: 'Paciente con cuadro infeccioso',
        observaciones: 'Tomar medicamentos puntualmente'
      } as any);
      idConsultaPrueba = consulta.idConsulta;

      const med = await medRepo.save({
        nombreMedicamento: 'Paracetamol 500mg',
        composicion: 'Paracetamol trihidrato 500mg',
        stockActual: 20,
        stockMinimo: 10,
        fechaVencimiento: '2028-12-31'
      } as any);
      idMedicamentoPrueba = med.idMedicamento;

      const orden1 = await ordenRepo.save({
        idConsulta: idConsultaPrueba,
        idMedicamento: idMedicamentoPrueba,
        cantidadRecetada: 5,
        cantidadEntregada: 0,
        estadoEntrega: 'PENDIENTE'
      } as any);
      idOrdenPendiente = orden1.idOrden;

      const orden2 = await ordenRepo.save({
        idConsulta: idConsultaPrueba,
        idMedicamento: idMedicamentoPrueba,
        cantidadRecetada: 5,
        cantidadEntregada: 5,
        estadoEntrega: 'ENTREGADO'
      } as any);
      idOrdenAtendida = orden2.idOrden;
    }
  });

  afterEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      const ordenRepo = dataSource.getRepository(OrdenMedicamentoModel);
      const consultaRepo = dataSource.getRepository(ConsultaModel);
      const citaRepo = dataSource.getRepository(CitaModel);
      const horarioRepo = dataSource.getRepository(HorarioModel);
      const medRepo = dataSource.getRepository(MedicamentoModel);

      await ordenRepo.delete({ idConsulta: MoreThan(0) });
      await consultaRepo.delete({ idConsulta: MoreThan(0) });
      await citaRepo.delete({ dniPaciente: DNI_PACIENTE_PRUEBA });
      await horarioRepo.delete({ dni: DNI_MEDICO_PRUEBA });
      await medRepo.delete({ idMedicamento: MoreThan(0) });
    }
  });

  it('ID 23 (Integración): Despacho exitoso, el estado pasa a atendido', async () => {
    const dto: DespacharRecetaDTO = {
      idOrden: idOrdenPendiente,
      idMedicamento: idMedicamentoPrueba,
      cantidadEntregada: 5
    };

    await farmaciaService.despacharReceta(dto, ROL_FARMACEUTICO);

    const ordenBD = await dataSource.getRepository(OrdenMedicamentoModel).findOneBy({ idOrden: idOrdenPendiente });
    expect(ordenBD?.estadoEntrega).toBe('ENTREGADO');

    const medBD = await dataSource.getRepository(MedicamentoModel).findOneBy({ idMedicamento: idMedicamentoPrueba });
    expect(medBD?.stockActual).toBe(15);
  });

  it('ID 24 (Integración): Rechazar despacho si el stock es insuficiente (Recetado: 10, Stock: 3)', async () => {
    const medRepo = dataSource.getRepository(MedicamentoModel);
    await medRepo.update(idMedicamentoPrueba, { stockActual: 3 });

    const dto: DespacharRecetaDTO = {
      idOrden: idOrdenPendiente,
      idMedicamento: idMedicamentoPrueba,
      cantidadEntregada: 10
    };

    await expect(farmaciaService.despacharReceta(dto, ROL_FARMACEUTICO)).rejects.toThrow(
      'Stock insuficiente'
    );
  });

  it('ID 25 (Integración): Rechazar despacho si la orden ya fue entregada previamente', async () => {
    const dto: DespacharRecetaDTO = {
      idOrden: idOrdenAtendida,
      idMedicamento: idMedicamentoPrueba,
      cantidadEntregada: 5
    };

    await expect(farmaciaService.despacharReceta(dto, ROL_FARMACEUTICO)).rejects.toThrow(
      'La orden ya fue entregada'
    );
  });

  it('ID 26 (Integración): Rechazar despacho si la cantidad entregada no es mayor a 0', async () => {
    const dto: DespacharRecetaDTO = {
      idOrden: idOrdenPendiente,
      idMedicamento: idMedicamentoPrueba,
      cantidadEntregada: 0
    };

    await expect(farmaciaService.despacharReceta(dto, ROL_FARMACEUTICO)).rejects.toThrow(
      'La cantidad debe ser mayor a 0'
    );
  });
});