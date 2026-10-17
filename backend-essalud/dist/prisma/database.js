"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSingleton = void 0;
const typeorm_1 = require("typeorm");
const PacienteModel_1 = require("../modules/pacientes/infrastructure/PacienteModel");
const UsuarioModel_1 = require("../modules/login/infrastructure/UsuarioModel");
const PersonalModel_1 = require("../modules/registropersonal/infrastructure/PersonalModel");
const HorarioModel_1 = require("../modules/registro-horario/infrastructure/HorarioModel");
const CitaModel_1 = require("../modules/citas/infrastructure/CitaModel");
// 🎯 NUEVAS IMPORTACIONES DE LOS MODELOS DE DIAGNÓSTICOS Y FARMACIA
const ConsultaModel_1 = require("../modules/diagnosticos/infrastructure/ConsultaModel");
const MedicamentoModel_1 = require("../modules/farmacia/infrastructure/MedicamentoModel");
const OrdenMedicamentoModel_1 = require("../modules/farmacia/infrastructure/OrdenMedicamentoModel");
class DatabaseSingleton {
    static instancia = null;
    dataSource;
    constructor() {
        this.dataSource = new typeorm_1.DataSource({
            type: 'mysql',
            host: '127.0.0.1',
            port: 3306,
            username: 'root',
            password: 'Peru101520@',
            database: 'essalud_db',
            synchronize: false,
            logging: false,
            // 🚀 REGISTRAMOS LOS NUEVOS COMPONENTES DE INFRAESTRUCTURA AQUÍ:
            entities: [
                PacienteModel_1.PacienteModel,
                UsuarioModel_1.UsuarioModel,
                PersonalModel_1.PersonalModel,
                PersonalModel_1.EspecialidadInline,
                HorarioModel_1.HorarioModel,
                CitaModel_1.CitaModel,
                ConsultaModel_1.ConsultaModel, // 🩺 Tabla consultas_medicas
                MedicamentoModel_1.MedicamentoModel, // 📦 Tabla medicamentos
                OrdenMedicamentoModel_1.OrdenMedicamentoModel // 💊 Tabla ordenes_medicamentos
            ],
        });
    }
    static obtenerInstancia() {
        if (!DatabaseSingleton.instancia) {
            DatabaseSingleton.instancia = new DatabaseSingleton();
        }
        return DatabaseSingleton.instancia;
    }
    async conectar() {
        if (!this.dataSource.isInitialized) {
            await this.dataSource.initialize();
        }
    }
    getDataSource() {
        return this.dataSource;
    }
}
exports.DatabaseSingleton = DatabaseSingleton;
//# sourceMappingURL=database.js.map