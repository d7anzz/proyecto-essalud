"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlCitaRepository = void 0;
const CitaModel_1 = require("./CitaModel");
const CitaMapper_1 = require("./CitaMapper");
class MysqlCitaRepository {
    repo;
    constructor(dataSource) {
        this.repo = dataSource.getRepository(CitaModel_1.CitaModel);
    }
    async crear(cita) {
        const rawData = CitaMapper_1.CitaMapper.toPersistence(cita);
        if (rawData.idCita === 0 || !rawData.idCita) {
            delete rawData.idCita;
        }
        const model = this.repo.create(rawData);
        const saved = await this.repo.save(model);
        return this.obtenerPorId(saved.idCita);
    }
    async listar() {
        const data = await this.repo.find({
            relations: {
                paciente: true,
                horario: {
                    personal: {
                        especialidad: true
                    }
                }
            }
        });
        return data.map(CitaMapper_1.CitaMapper.toDomain);
    }
    async obtenerPorId(id) {
        const data = await this.repo.findOne({
            where: { idCita: id },
            relations: {
                paciente: true,
                horario: {
                    personal: {
                        especialidad: true
                    }
                }
            }
        });
        return data ? CitaMapper_1.CitaMapper.toDomain(data) : null;
    }
    async actualizar(id, datos) {
        const rawData = CitaMapper_1.CitaMapper.toPersistence(datos);
        delete rawData.idCita;
        await this.repo.update({ idCita: id }, rawData);
        return this.obtenerPorId(id);
    }
    async eliminar(id) {
        const res = await this.repo.delete({ idCita: id });
        return (res.affected ?? 0) > 0;
    }
}
exports.MysqlCitaRepository = MysqlCitaRepository;
//# sourceMappingURL=MysqlCitaRepository.js.map