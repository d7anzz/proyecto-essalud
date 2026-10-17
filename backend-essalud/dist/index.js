"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./prisma/database");
const ModuleAbstractFactory_1 = require("./functions/ModuleAbstractFactory");
const PacienteRoutes_1 = require("./modules/pacientes/presentation/PacienteRoutes");
const LoginRoutes_1 = require("./modules/login/presentation/LoginRoutes");
const PersonalRoutes_1 = require("./modules/registropersonal/presentation/PersonalRoutes");
const HorarioRoutes_1 = require("./modules/registro-horario/presentation/HorarioRoutes");
const CitaRoutes_1 = require("./modules/citas/presentation/CitaRoutes");
const ConsultaRoutes_1 = require("./modules/diagnosticos/presentation/ConsultaRoutes");
const FarmaciaRoutes_1 = require("./modules/farmacia/presentation/FarmaciaRoutes");
const ReportesRoutes_1 = require("./modules/reportes/presentation/ReportesRoutes");
const HistoriasRoutes_1 = require("./modules/historias/presentation/HistoriasRoutes");
const authMiddleware_1 = require("./shared/middlewares/authMiddleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
async function iniciarSistema() {
    try {
        const db = database_1.DatabaseSingleton.obtenerInstancia();
        await db.conectar();
        console.log('[Database] Conexión única a MySQL establecida mediante Singleton.');
        const dataSourceReal = db.getDataSource();
        const moduleFactory = new ModuleAbstractFactory_1.MysqlModuleFactory(dataSourceReal);
        const modules = moduleFactory.construirTodosLosModulos();
        // Ruta pública: login y cambio de contraseña
        app.use('/api/auth', (0, LoginRoutes_1.LoginRoutes)(modules.controladorLogin, modules.controladorActualizarPassword));
        // Rutas protegidas con JWT
        app.use('/api/pacientes', authMiddleware_1.verificarJWT, (0, PacienteRoutes_1.configurarRutasPacientes)(modules.controladorPacientes));
        app.use('/api/personal', authMiddleware_1.verificarJWT, (0, PersonalRoutes_1.configurarRutasPersonal)(modules.controladorPersonal));
        app.use('/api/horarios', authMiddleware_1.verificarJWT, (0, HorarioRoutes_1.configurarRutasHorario)(modules.controladorHorarios));
        app.use('/api/citas', authMiddleware_1.verificarJWT, (0, CitaRoutes_1.configurarRutasCita)(modules.controladorCitas));
        app.use('/api/consultas', authMiddleware_1.verificarJWT, (0, ConsultaRoutes_1.configurarRutasConsulta)(modules.controladorConsultas));
        app.use('/api/farmacia', authMiddleware_1.verificarJWT, (0, FarmaciaRoutes_1.configurarRutasFarmacia)(modules.controladorFarmacia));
        // Nuevos módulos
        app.use('/api/reportes', authMiddleware_1.verificarJWT, (0, ReportesRoutes_1.configurarRutasReportes)(dataSourceReal));
        app.use('/api/historias', authMiddleware_1.verificarJWT, (0, HistoriasRoutes_1.configurarRutasHistorias)(dataSourceReal));
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Servidor de EsSalud corriendo con éxito en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Error al iniciar el sistema de EsSalud:', error);
    }
}
iniciarSistema();
//# sourceMappingURL=index.js.map