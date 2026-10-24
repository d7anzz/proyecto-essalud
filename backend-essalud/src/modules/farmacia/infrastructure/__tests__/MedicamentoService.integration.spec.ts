import { DataSource, MoreThan } from 'typeorm';
import { MysqlFarmaciaRepository } from '../MysqlFarmaciaRepository';
import { FarmaciaService } from '../../application/FarmaciaService';
import { MedicamentoModel } from '../MedicamentoModel';
import { OrdenMedicamentoModel } from '../OrdenMedicamentoModel';
import { IngresarMedicamentoDTO } from '../../application/IngresarMedicamentoDTO';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('Pruebas de Integración: Módulo Registro de Medicamentos (Casos ID 19 al 22)', () => {
  let dataSource: DataSource;
  let farmaciaService: FarmaciaService;

  const ROL_FARMACEUTICO = 3;

  const obtenerFechaFuturaMeses = (meses: number): string => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + meses);
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
      entities: [
        MedicamentoModel,
        OrdenMedicamentoModel
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
      const medRepo = dataSource.getRepository(MedicamentoModel);
      await medRepo.delete({ idMedicamento: MoreThan(0) });
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      const medRepo = dataSource.getRepository(MedicamentoModel);
      await medRepo.delete({ idMedicamento: MoreThan(0) });
    }
  });

  afterEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      const medRepo = dataSource.getRepository(MedicamentoModel);
      await medRepo.delete({ idMedicamento: MoreThan(0) });
    }
  });

  it('ID 19 (Integración): Registrar medicamento exitosamente', async () => {
    const dto: IngresarMedicamentoDTO = {
      nombreMedicamento: 'Paracetamol 500mg',
      composicion: 'Paracetamol trihidrato 500mg',
      cantidadIngreso: 50,
      stockMinimo: 10,
      fechaVencimiento: obtenerFechaFuturaMeses(6)
    };

    const resultado = await farmaciaService.registrarMedicamento(dto, ROL_FARMACEUTICO);

    expect(resultado).not.toBeNull();
    expect(resultado.nombreMedicamento).toBe('Paracetamol 500mg');

    const medEnBD = await dataSource.getRepository(MedicamentoModel).findOneBy({
      nombreMedicamento: 'Paracetamol 500mg'
    });
    expect(medEnBD).not.toBeNull();
    expect(medEnBD?.stockActual).toBe(50);
  });

  it('ID 20 (Integración): Registro exitoso, dispara la alerta de stock crítico', async () => {
    const dto: IngresarMedicamentoDTO = {
      nombreMedicamento: 'Paracetamol 500mg',
      composicion: 'Paracetamol trihidrato 500mg',
      cantidadIngreso: 10,
      stockMinimo: 10,
      fechaVencimiento: obtenerFechaFuturaMeses(6)
    };

    const resultado = await farmaciaService.registrarMedicamento(dto, ROL_FARMACEUTICO);

    expect(resultado).not.toBeNull();
    expect(resultado.stockActual).toBeLessThanOrEqual(resultado.stockMinimo);

    const medEnBD = await dataSource.getRepository(MedicamentoModel).findOneBy({
      nombreMedicamento: 'Paracetamol 500mg'
    });
    expect(medEnBD?.stockActual).toBe(10);
  });

  it('ID 21 (Integración): Rechazar registro si el stock es un número negativo', async () => {
    const dto: IngresarMedicamentoDTO = {
      nombreMedicamento: 'Paracetamol 500mg',
      composicion: 'Paracetamol trihidrato 500mg',
      cantidadIngreso: -5,
      stockMinimo: 10,
      fechaVencimiento: obtenerFechaFuturaMeses(6)
    };

    await expect(farmaciaService.registrarMedicamento(dto, ROL_FARMACEUTICO)).rejects.toThrow(
      'El stock no puede ser un número negativo'
    );
  });

  it('ID 22 (Integración): Rechazar registro si la fecha de vencimiento no es mayor a 2 meses', async () => {
    const dto: IngresarMedicamentoDTO = {
      nombreMedicamento: 'Paracetamol 500mg',
      composicion: 'Paracetamol trihidrato 500mg',
      cantidadIngreso: 50,
      stockMinimo: 10,
      fechaVencimiento: obtenerFechaFuturaMeses(1)
    };

    await expect(farmaciaService.registrarMedicamento(dto, ROL_FARMACEUTICO)).rejects.toThrow(
      'La fecha de vencimiento debe ser mayor a 2 meses'
    );
  });
});