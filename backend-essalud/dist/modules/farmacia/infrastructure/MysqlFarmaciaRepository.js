"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlFarmaciaRepository = void 0;
const MedicamentoModel_1 = require("./MedicamentoModel");
const MedicamentoMapper_1 = require("./MedicamentoMapper");
// 🎯 IMPORTACIONES CORRECTAS: Conexión local e intermedia de recetas
const OrdenMedicamentoModel_1 = require("./OrdenMedicamentoModel");
class MysqlFarmaciaRepository {
    dataSource;
    repoMedicamento;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.repoMedicamento = dataSource.getRepository(MedicamentoModel_1.MedicamentoModel);
    }
    // 📦 SECCIÓN INVENTARIO: Listar todo el catálogo ordenado alfabéticamente
    async listarInventario() {
        try {
            const models = await this.repoMedicamento.find({ order: { nombreMedicamento: 'ASC' } });
            return models.map(MedicamentoMapper_1.MedicamentoMapper.toDomain);
        }
        catch (error) {
            console.error('💥 Error al listar inventario de farmacia:', error);
            throw new Error('Error interno al recuperar el inventario.');
        }
    }
    // 📦 SECCIÓN INVENTARIO: Insertar o abastecer nuevos lotes de fármacos
    async ingresarMedicamento(medicamento) {
        try {
            const raw = MedicamentoMapper_1.MedicamentoMapper.toPersistence(medicamento);
            const model = this.repoMedicamento.create(raw);
            const guardado = await this.repoMedicamento.save(model);
            return MedicamentoMapper_1.MedicamentoMapper.toDomain(guardado);
        }
        catch (error) {
            console.error('💥 Error al registrar nuevo medicamento:', error);
            throw new Error('Error interno al almacenar el fármaco en el inventario.');
        }
    }
    // 💊 SECCIÓN ENTREGA: Cargar recetas (Ahora incluye Pendientes y Entregadas para el flujo de Tabs)
    async listarRecetasPendientes(dniPaciente) {
        try {
            // 🚀 Inicializamos el QueryBuilder trayendo la data base limpia sin restricciones de estado
            const queryBuilder = this.dataSource
                .createQueryBuilder(OrdenMedicamentoModel_1.OrdenMedicamentoModel, 'om')
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
                'om.estado_entrega AS estadoEntrega' // Retorna 'PENDIENTE' o 'ENTREGADO' dinámicamente
            ]);
            // 🔍 Si el farmacéutico digita un DNI, usamos .where() de manera segura
            if (dniPaciente && dniPaciente.trim() !== '') {
                queryBuilder.where('cm.dni_paciente = :dni', { dni: dniPaciente.trim() });
            }
            // 🔄 Ordenamos cronológicamente a la inversa e intercalamos por estado para una mejor lectura en UI
            queryBuilder.orderBy('om.estado_entrega', 'DESC').addOrderBy('om.id_orden', 'DESC');
            return await queryBuilder.getRawMany();
        }
        catch (error) {
            console.error('💥 Error al listar recetas en farmacia:', error);
            throw new Error('Error interno al procesar la bandeja de recetas.');
        }
    }
    // 💊 SECCIÓN ENTREGA: Despacho atómico transaccional (Resta stock + Completa orden)
    async despacharRecetaTransaccional(idOrden, idMedicamento, cantidadEntregada) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // 1. Verificar la existencia y stock del fármaco dentro de la transacción
            const medicamento = await queryRunner.manager.findOne(MedicamentoModel_1.MedicamentoModel, {
                where: { idMedicamento }
            });
            if (!medicamento) {
                throw new Error('El medicamento seleccionado no existe en el catálogo de farmacia.');
            }
            if (medicamento.stockActual < cantidadEntregada) {
                throw new Error(`🚫 Stock Insuficiente: Solo quedan ${medicamento.stockActual} unidades disponibles de ${medicamento.nombreMedicamento}.`);
            }
            // 2. Restar físicamente la cantidad entregada del stock maestro
            const nuevoStock = medicamento.stockActual - cantidadEntregada;
            await queryRunner.manager.update(MedicamentoModel_1.MedicamentoModel, idMedicamento, { stockActual: nuevoStock });
            // 3. Modificar la orden de medicamentos a estado ENTREGADO
            await queryRunner.manager.update(OrdenMedicamentoModel_1.OrdenMedicamentoModel, idOrden, {
                cantidadEntregada,
                estadoEntrega: 'ENTREGADO'
            });
            // Si ambos pasos se ejecutan de manera perfecta, consolidamos en MySQL
            await queryRunner.commitTransaction();
        }
        catch (error) {
            // Si falta stock o se cae la conexión, revertimos todo para no desajustar el inventario
            await queryRunner.rollbackTransaction();
            console.error('💥 [Transaction Error] Falló el despacho en farmacia:', error);
            throw error;
        }
        finally {
            // Liberamos los recursos del QueryRunner de forma segura
            await queryRunner.release();
        }
    }
}
exports.MysqlFarmaciaRepository = MysqlFarmaciaRepository;
//# sourceMappingURL=MysqlFarmaciaRepository.js.map