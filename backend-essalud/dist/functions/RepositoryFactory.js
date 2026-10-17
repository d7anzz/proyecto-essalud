"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlRepositoryFactory = exports.RepositoryFactory = void 0;
const MysqlLoginRepository_1 = require("../modules/login/infrastructure/MysqlLoginRepository");
const MysqlPacienteRepository_1 = require("../modules/pacientes/infrastructure/MysqlPacienteRepository");
const MysqlPersonaRepository_1 = require("../modules/registropersonal/infrastructure/MysqlPersonaRepository");
const MysqlHorarioRepository_1 = require("../modules/registro-horario/infrastructure/MysqlHorarioRepository");
const MysqlCitaRepository_1 = require("../modules/citas/infrastructure/MysqlCitaRepository");
const MysqlConsultaRepository_1 = require("../modules/diagnosticos/infrastructure/MysqlConsultaRepository");
const MysqlFarmaciaRepository_1 = require("../modules/farmacia/infrastructure/MysqlFarmaciaRepository");
const PacienteModel_1 = require("../modules/pacientes/infrastructure/PacienteModel");
const UsuarioModel_1 = require("../modules/login/infrastructure/UsuarioModel");
class RepositoryFactory {
}
exports.RepositoryFactory = RepositoryFactory;
class MysqlRepositoryFactory extends RepositoryFactory {
    db;
    constructor(db) {
        super();
        this.db = db;
    }
    crearLoginRepository() {
        const ormRepo = this.db.getRepository(UsuarioModel_1.UsuarioModel);
        return new MysqlLoginRepository_1.MysqlLoginRepository(ormRepo);
    }
    crearPacienteRepository() {
        const ormRepo = this.db.getRepository(PacienteModel_1.PacienteModel);
        return new MysqlPacienteRepository_1.MysqlPacienteRepository(ormRepo);
    }
    crearPersonalRepository() {
        return new MysqlPersonaRepository_1.MysqlPersonalRepository(this.db);
    }
    crearHorarioRepository() {
        return new MysqlHorarioRepository_1.MysqlHorarioRepository(this.db);
    }
    crearCitaRepository() {
        return new MysqlCitaRepository_1.MysqlCitaRepository(this.db);
    }
    // 🩺 IMPLEMENTACIÓN PARA EL MÓDULO DE DIAGNÓSTICOS
    crearConsultaRepository() {
        return new MysqlConsultaRepository_1.MysqlConsultaRepository(this.db);
    }
    // 💊 IMPLEMENTACIÓN PARA EL MÓDULO DE INVENTARIO Y ENTREGAS
    crearFarmaciaRepository() {
        return new MysqlFarmaciaRepository_1.MysqlFarmaciaRepository(this.db);
    }
}
exports.MysqlRepositoryFactory = MysqlRepositoryFactory;
//# sourceMappingURL=RepositoryFactory.js.map