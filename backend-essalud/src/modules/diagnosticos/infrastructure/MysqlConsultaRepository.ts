import { DataSource } from 'typeorm';
import { ConsultaRepository } from '../domain/ConsultaRepository';
import { Consulta } from '../domain/Consulta';
import { ConsultaModel } from './ConsultaModel';
import { CitaModel } from '../../citas/infrastructure/CitaModel';
import { OrdenMedicamentoModel } from '../../farmacia/infrastructure/OrdenMedicamentoModel';

export class MysqlConsultaRepository implements ConsultaRepository {
  constructor(private readonly dataSource: DataSource) {}

  async crearTransaccional(
    consulta: Consulta, 
    medicamentos: Array<{ idMedicamento: number; cantidadRecetada: number }>
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const nuevaConsulta = queryRunner.manager.create(ConsultaModel, {
        idCita: consulta.idCita,
        dniPaciente: consulta.dniPaciente,
        idMedico: consulta.idMedico,
        diagnostico: consulta.diagnostico,
        observaciones: consulta.observaciones
      });
      const consultaGuardada = await queryRunner.manager.save(nuevaConsulta);

      if (medicamentos.length > 0) {
        const ordenesALanzar = medicamentos.map(med => 
          // 🚀 Ahora TypeORM reconocerá el modelo perfectamente aquí
          queryRunner.manager.create(OrdenMedicamentoModel, {
            idConsulta: consultaGuardada.idConsulta,
            idMedicamento: med.idMedicamento,
            cantidadRecetada: med.cantidadRecetada,
            cantidadEntregada: 0,
            estadoEntrega: 'PENDIENTE'
          })
        );
        await queryRunner.manager.save(OrdenMedicamentoModel, ordenesALanzar);
      }

      await queryRunner.manager.update(CitaModel, consulta.idCita, {
        estado: 'COMPLETADA'
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}