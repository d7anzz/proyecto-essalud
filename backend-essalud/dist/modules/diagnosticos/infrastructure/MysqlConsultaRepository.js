"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlConsultaRepository = void 0;
const ConsultaModel_1 = require("./ConsultaModel");
const CitaModel_1 = require("../../citas/infrastructure/CitaModel");
const OrdenMedicamentoModel_1 = require("../../farmacia/infrastructure/OrdenMedicamentoModel");
class MysqlConsultaRepository {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async crearTransaccional(consulta, medicamentos) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const nuevaConsulta = queryRunner.manager.create(ConsultaModel_1.ConsultaModel, {
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
                queryRunner.manager.create(OrdenMedicamentoModel_1.OrdenMedicamentoModel, {
                    idConsulta: consultaGuardada.idConsulta,
                    idMedicamento: med.idMedicamento,
                    cantidadRecetada: med.cantidadRecetada,
                    cantidadEntregada: 0,
                    estadoEntrega: 'PENDIENTE'
                }));
                await queryRunner.manager.save(OrdenMedicamentoModel_1.OrdenMedicamentoModel, ordenesALanzar);
            }
            await queryRunner.manager.update(CitaModel_1.CitaModel, consulta.idCita, {
                estado: 'COMPLETADA'
            });
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.MysqlConsultaRepository = MysqlConsultaRepository;
//# sourceMappingURL=MysqlConsultaRepository.js.map