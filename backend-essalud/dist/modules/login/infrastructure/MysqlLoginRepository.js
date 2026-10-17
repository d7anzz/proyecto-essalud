"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlLoginRepository = void 0;
const UsuarioMapper_1 = require("./UsuarioMapper");
class MysqlLoginRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async buscarPorDni(dni) {
        const modeloAsociado = await this.repo.findOne({ where: { dni } });
        if (!modeloAsociado)
            return null;
        return UsuarioMapper_1.UsuarioMapper.toDomain(modeloAsociado);
    }
    async actualizarEstado(usuario) {
        const modeloParaPersistir = UsuarioMapper_1.UsuarioMapper.toPersistence(usuario);
        await this.repo.save(modeloParaPersistir);
    }
}
exports.MysqlLoginRepository = MysqlLoginRepository;
//# sourceMappingURL=MysqlLoginRepository.js.map