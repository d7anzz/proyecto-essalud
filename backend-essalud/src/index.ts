import 'reflect-metadata'; 
import express from 'express';
import cors from 'cors';

import { DatabaseSingleton } from './prisma/database';
import { MysqlModuleFactory } from './functions/ModuleAbstractFactory'; 

import { configurarRutasPacientes } from './modules/pacientes/presentation/PacienteRoutes'; 
import { LoginRoutes } from './modules/login/presentation/LoginRoutes';
import { configurarRutasPersonal } from './modules/registropersonal/presentation/PersonalRoutes';
import { configurarRutasHorario } from './modules/registro-horario/presentation/HorarioRoutes'; 
import { configurarRutasCita } from './modules/citas/presentation/CitaRoutes';
import { configurarRutasConsulta } from './modules/diagnosticos/presentation/ConsultaRoutes';
import { configurarRutasFarmacia } from './modules/farmacia/presentation/FarmaciaRoutes';
import { configurarRutasReportes } from './modules/reportes/presentation/ReportesRoutes';
import { configurarRutasHistorias } from './modules/historias/presentation/HistoriasRoutes';

import { verificarJWT } from './shared/middlewares/authMiddleware';

const app = express();

app.use(cors());
app.use(express.json()); 

async function iniciarSistema() {
  try {
    const db = DatabaseSingleton.obtenerInstancia();
    await db.conectar();

    console.log('[Database] Conexión única a MySQL establecida mediante Singleton.');

    const dataSourceReal = db.getDataSource();

    const moduleFactory = new MysqlModuleFactory(dataSourceReal);
    const modules = moduleFactory.construirTodosLosModulos();

    // Ruta pública: login y cambio de contraseña
    app.use('/api/auth', LoginRoutes(
      modules.controladorLogin,
      modules.controladorActualizarPassword
    ));

    // Rutas protegidas con JWT
    app.use('/api/pacientes', verificarJWT, configurarRutasPacientes(modules.controladorPacientes));
    app.use('/api/personal', verificarJWT, configurarRutasPersonal(modules.controladorPersonal));
    app.use('/api/horarios', verificarJWT, configurarRutasHorario(modules.controladorHorarios));
    app.use('/api/citas', verificarJWT, configurarRutasCita(modules.controladorCitas));
    app.use('/api/consultas', verificarJWT, configurarRutasConsulta(modules.controladorConsultas));
    app.use('/api/farmacia', verificarJWT, configurarRutasFarmacia(modules.controladorFarmacia));

    // Nuevos módulos
    app.use('/api/reportes', verificarJWT, configurarRutasReportes(dataSourceReal));
    app.use('/api/historias', verificarJWT, configurarRutasHistorias(dataSourceReal));

    const PORT = 3000;

    app.listen(PORT, () => {
      console.log(`Servidor de EsSalud corriendo con éxito en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error al iniciar el sistema de EsSalud:', error);
  }
}

iniciarSistema();