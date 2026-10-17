"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlPersonalRepository = void 0;
const PersonalModel_1 = require("./PersonalModel");
const UsuarioModel_1 = require("../../login/infrastructure/UsuarioModel");
const PersonalMapper_1 = require("./PersonalMapper");
const UsuarioMapper_1 = require("../../login/infrastructure/UsuarioMapper");
class MysqlPersonalRepository {
    dataSource;
    personalRepo;
    usuarioRepo;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.personalRepo = this.dataSource.getRepository(PersonalModel_1.PersonalModel);
        this.usuarioRepo = this.dataSource.getRepository(UsuarioModel_1.UsuarioModel);
    }
    async existePorDni(dni) {
        const dniLimpio = dni.trim();
        const registro = await this.personalRepo.findOne({ where: { dni: dniLimpio } });
        return registro !== null;
    }
    async obtenerEspecialidadPorDni(dni) {
        const dniLimpio = dni.trim();
        const personal = await this.personalRepo.findOne({
            where: { dni: dniLimpio },
            relations: { especialidad: true }
        });
        if (!personal) {
            return null;
        }
        return personal.idEspecialidad ? Number(personal.idEspecialidad) : null;
    }
    async guardarPersonalYCredenciales(usuario, personal) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const usuarioModel = UsuarioMapper_1.UsuarioMapper.toPersistence(usuario);
            const personalModel = PersonalMapper_1.PersonalMapper.toPersistence(personal);
            await queryRunner.manager.save(UsuarioModel_1.UsuarioModel, usuarioModel);
            await queryRunner.manager.save(PersonalModel_1.PersonalModel, personalModel);
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
exports.MysqlPersonalRepository = MysqlPersonalRepository;
//# sourceMappingURL=MysqlPersonaRepository.js.map