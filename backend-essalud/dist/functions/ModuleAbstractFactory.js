"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlModuleFactory = exports.AbstractModuleFactory = void 0;
const LoginController_1 = require("../modules/login/presentation/LoginController");
const PacienteController_1 = require("../modules/pacientes/presentation/PacienteController");
const PersonalController_1 = require("../modules/registropersonal/presentation/PersonalController");
const HorarioController_1 = require("../modules/registro-horario/presentation/HorarioController");
const CitaController_1 = require("../modules/citas/presentation/CitaController");
// 🎯 CORRECCIÓN DE RUTAS: Apuntamos al nuevo módulo de diagnosticos
const ConsultaController_1 = require("../modules/diagnosticos/presentation/ConsultaController");
const FarmaciaController_1 = require("../modules/farmacia/presentation/FarmaciaController");
const LoginService_1 = require("../modules/login/application/LoginService");
const ActualizarPasswordService_1 = require("../modules/login/application/ActualizarPasswordService");
const CambiarPasswordPerfilService_1 = require("../modules/login/application/CambiarPasswordPerfilService");
const HorarioService_1 = require("../modules/registro-horario/application/HorarioService");
const ActualizarPasswordController_1 = require("../modules/login/presentation/ActualizarPasswordController");
const PacienteService_1 = require("../modules/pacientes/application/PacienteService");
const RegistrarPersonalService_1 = require("../modules/registropersonal/application/RegistrarPersonalService");
const CitaService_1 = require("../modules/citas/application/CitaService");
// 🎯 CORRECCIÓN DE RUTAS: Servicio de la aplicación cambiado a diagnosticos
const ConsultaService_1 = require("../modules/diagnosticos/application/ConsultaService");
const FarmaciaService_1 = require("../modules/farmacia/application/FarmaciaService");
const RepositoryFactory_1 = require("./RepositoryFactory");
class AbstractModuleFactory {
    construirTodosLosModulos() {
        return {
            controladorLogin: this.crearLoginModule(),
            controladorActualizarPassword: this.crearActualizarPasswordModule(),
            controladorPacientes: this.crearPacientesModule(),
            controladorPersonal: this.crearPersonalModule(),
            controladorHorarios: this.crearHorariosModule(),
            controladorCitas: this.crearCitasModule(),
            controladorConsultas: this.crearConsultasModule(),
            controladorFarmacia: this.crearFarmaciaModule(),
        };
    }
}
exports.AbstractModuleFactory = AbstractModuleFactory;
class MysqlModuleFactory extends AbstractModuleFactory {
    dataSource;
    repoFactory;
    constructor(dataSource) {
        super();
        this.dataSource = dataSource;
        this.repoFactory = new RepositoryFactory_1.MysqlRepositoryFactory(this.dataSource);
    }
    crearLoginModule() {
        const repo = this.repoFactory.crearLoginRepository();
        const service = new LoginService_1.LoginService(repo);
        return new LoginController_1.LoginController(service);
    }
    crearActualizarPasswordModule() {
        const repo = this.repoFactory.crearLoginRepository();
        const serviceInicial = new ActualizarPasswordService_1.ActualizarPasswordInicialService(repo);
        const servicePerfil = new CambiarPasswordPerfilService_1.CambiarPasswordPerfilService(repo);
        return new ActualizarPasswordController_1.ActualizarPasswordController(serviceInicial, servicePerfil);
    }
    crearPacientesModule() {
        const repo = this.repoFactory.crearPacienteRepository();
        const service = new PacienteService_1.PacienteService(repo);
        return new PacienteController_1.PacientesController(service);
    }
    crearPersonalModule() {
        const repo = this.repoFactory.crearPersonalRepository();
        const service = new RegistrarPersonalService_1.RegistrarPersonalService(repo);
        return new PersonalController_1.PersonalController(service);
    }
    crearHorariosModule() {
        const repoHorarios = this.repoFactory.crearHorarioRepository();
        const servicioHorarios = new HorarioService_1.HorarioService(repoHorarios);
        return new HorarioController_1.HorarioController(servicioHorarios);
    }
    crearCitasModule() {
        const repoCitas = this.repoFactory.crearCitaRepository();
        const repoHorarios = this.repoFactory.crearHorarioRepository();
        const servicioCitas = new CitaService_1.CitaService(repoCitas, repoHorarios);
        return new CitaController_1.CitaController(servicioCitas);
    }
    crearConsultasModule() {
        // 🚀 Ahora llamará nativamente al nuevo método limpio de RepositoryFactory.ts
        const repoConsultas = this.repoFactory.crearConsultaRepository();
        const servicioConsultas = new ConsultaService_1.ConsultaService(repoConsultas);
        return new ConsultaController_1.ConsultaController(servicioConsultas);
    }
    crearFarmaciaModule() {
        const repoFarmacia = this.repoFactory.crearFarmaciaRepository();
        const servicioFarmacia = new FarmaciaService_1.FarmaciaService(repoFarmacia);
        return new FarmaciaController_1.FarmaciaController(servicioFarmacia);
    }
}
exports.MysqlModuleFactory = MysqlModuleFactory;
//# sourceMappingURL=ModuleAbstractFactory.js.map