import { DataSource, Repository } from 'typeorm';
import { FarmaciaRepository } from '../domain/FarmaciaRepository';
import { Medicamento } from '../domain/Medicamento';
import { MedicamentoModel } from './MedicamentoModel';
import { MedicamentoMapper } from './MedicamentoMapper';
import { OrdenMedicamentoModel } from './OrdenMedicamentoModel';

export class MysqlFarmaciaRepository implements FarmaciaRepository {
  private readonly repoMedicamento: Repository<MedicamentoModel>;

  constructor(private readonly dataSource: DataSource) {
    this.repoMedicamento = dataSource.getRepository(MedicamentoModel);
  }

  async listarInventario(): Promise<Medicamento[]> {
    try {
      const models = await this.repoMedicamento.find({ order: { nombreMedicamento: 'ASC' } });
      return models.map(MedicamentoMapper.toDomain);
    } catch (error) {
      console.error('Error al listar inventario de farmacia:', error);
      throw new Error('Error interno al recuperar el inventario.');
    }
  }

  async ingresarMedicamento(medicamento: Medicamento): Promise<Medicamento> {
    try {
      const raw = MedicamentoMapper.toPersistence(medicamento);
      const model = this.repoMedicamento.create(raw);
      const guardado = await this.repoMedicamento.save(model);
      return MedicamentoMapper.toDomain(guardado);
    } catch (error) {
      console.error('Error al registrar nuevo medicamento:', error);
      throw new Error('Error interno al almacenar el fármaco en el inventario.');
    }
  }

  async listarRecetasPendientes(dniPaciente?: string): Promise<any[]> {
    try {
      const queryBuilder = this.dataSource
        .createQueryBuilder(OrdenMedicamentoModel, 'om')
        .innerJoin('consultas_medicas', 'cm', 'cm.id_consulta = om.id_consulta')
        .innerJoin('medicamentos', 'm', 'm.id_medicamento = om.id_medicamento')
        .select([
          'om.id_orden AS idOrden',
          'om.id_consulta AS idConsulta',
          'cm.id_cita AS idCita',
          'cm.dni_paciente AS dniPaciente',
          'm.id_medicamento AS idMedicamento',
          'm.nombre_medicamento AS nombreMedicamento',
          'om.cantidad_recetada AS cantidadRecetada',
          'om.estado_entrega AS estadoEntrega'
        ]);

      if (dniPaciente && dniPaciente.trim() !== '') {
        queryBuilder.where('cm.dni_paciente = :dni', { dni: dniPaciente.trim() });
      }

      queryBuilder.orderBy('om.estado_entrega', 'DESC').addOrderBy('om.id_orden', 'DESC');

      return await queryBuilder.getRawMany();
    } catch (error) {
      console.error('Error al listar recetas en farmacia:', error);
      throw new Error('Error interno al procesar la bandeja de recetas.');
    }
  }

  async despacharRecetaTransaccional(idOrden: number, idMedicamento: number, cantidadEntregada: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orden = await queryRunner.manager.findOne(OrdenMedicamentoModel, {
        where: { idOrden }
      });

      if (!orden) {
        throw new Error('La orden de medicamento no existe.');
      }

      if (orden.estadoEntrega === 'ENTREGADO' || orden.estadoEntrega === 'ENTREGADA') {
        throw new Error('La orden ya fue entregada');
      }

      const medicamento = await queryRunner.manager.findOne(MedicamentoModel, { 
        where: { idMedicamento } 
      });

      if (!medicamento) {
        throw new Error('El medicamento seleccionado no existe en el catálogo de farmacia.');
      }

      if (medicamento.stockActual < cantidadEntregada) {
        throw new Error('Stock insuficiente');
      }

      const nuevoStock = medicamento.stockActual - cantidadEntregada;
      await queryRunner.manager.update(MedicamentoModel, idMedicamento, { stockActual: nuevoStock });

      await queryRunner.manager.update(OrdenMedicamentoModel, idOrden, {
        cantidadEntregada,
        estadoEntrega: 'ENTREGADO'
      });

      await queryRunner.commitTransaction();
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      console.error('Error en transacción de despacho en farmacia:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}