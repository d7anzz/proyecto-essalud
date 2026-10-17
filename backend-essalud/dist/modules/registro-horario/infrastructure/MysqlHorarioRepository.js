"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlHorarioRepository = void 0;
const HorarioModel_1 = require("./HorarioModel");
const HorarioMapper_1 = require("./HorarioMapper");
class MysqlHorarioRepository {
    repo;
    constructor(dataSource) {
        this.repo = dataSource.getRepository(HorarioModel_1.HorarioModel);
    }
    async crear(horario) {
        try {
            const rawData = HorarioMapper_1.HorarioMapper.toPersistence(horario);
            if (rawData.id === 0 || !rawData.id) {
                delete rawData.id;
            }
            const model = this.repo.create(rawData);
            const saved = await this.repo.save(model);
            const refetched = await this.repo.findOneBy({ id: saved.id });
            return HorarioMapper_1.HorarioMapper.toDomain(refetched || saved);
        }
        catch (error) {
            console.error('💥 [TypeORM Error] Fallo al insertar horario en la base de datos:', error);
            throw new Error('Error interno al registrar el horario en MySQL.');
        }
    }
    async listar() {
        try {
            const models = await this.repo.find({
                relations: {
                    personal: {
                        especialidad: true
                    }
                }
            });
            return models.map(HorarioMapper_1.HorarioMapper.toDomain);
        }
        catch (error) {
            console.error('💥 [TypeORM Error] Fallo al listar horarios con especialidades:', error);
            throw new Error('Error interno al recuperar los horarios.');
        }
    }
    async obtenerPorId(id) {
        const model = await this.repo.findOneBy({ id });
        return model ? HorarioMapper_1.HorarioMapper.toDomain(model) : null;
    }
    async actualizar(id, datos) {
        try {
            const rawData = HorarioMapper_1.HorarioMapper.toPersistence(datos);
            delete rawData.id;
            delete rawData.personal;
            await this.repo.update(id, rawData);
            return this.obtenerPorId(id);
        }
        catch (error) {
            console.error(`💥 [TypeORM Error] Fallo al actualizar el horario ${id}:`, error);
            throw error;
        }
    }
    async eliminar(id) {
        const result = await this.repo.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async buscarPorMedicoYFecha(dni, fecha) {
        try {
            const models = await this.repo.find({
                where: { dni, fecha }
            });
            return models.map(HorarioMapper_1.HorarioMapper.toDomain);
        }
        catch (error) {
            console.error('💥 [TypeORM Error] Fallo al buscar horarios por médico y fecha:', error);
            throw new Error('Error interno al verificar duplicados en la base de datos.');
        }
    }
}
exports.MysqlHorarioRepository = MysqlHorarioRepository;
//# sourceMappingURL=MysqlHorarioRepository.js.map