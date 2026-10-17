"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlPacienteRepository = void 0;
const typeorm_1 = require("typeorm");
const PacienteMapper_1 = require("./PacienteMapper");
class MysqlPacienteRepository {
    ormRepository;
    constructor(ormRepository) {
        this.ormRepository = ormRepository;
    }
    async guardar(paciente) {
        const modeloBD = PacienteMapper_1.PacienteMapper.toPersistence(paciente);
        await this.ormRepository.save(modeloBD);
    }
    async buscarPorDni(dni) {
        const modeloBD = await this.ormRepository.findOne({ where: { dni } });
        if (!modeloBD)
            return null;
        return PacienteMapper_1.PacienteMapper.toDomain(modeloBD);
    }
    async buscarCoincidenciasPorDni(dni) {
        const modelosBD = await this.ormRepository.find({
            where: {
                dni: (0, typeorm_1.Like)(`${dni}%`)
            },
            take: 8
        });
        return modelosBD.map(modelo => PacienteMapper_1.PacienteMapper.toDomain(modelo));
    }
    async obtenerTodos() {
        const modelosBD = await this.ormRepository.find();
        return modelosBD.map(modelo => PacienteMapper_1.PacienteMapper.toDomain(modelo));
    }
    async eliminarPorDni(dni) {
        await this.ormRepository.delete({ dni });
    }
}
exports.MysqlPacienteRepository = MysqlPacienteRepository;
//# sourceMappingURL=MysqlPacienteRepository.js.map