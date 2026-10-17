import { DataSource } from 'typeorm'; 
import { LoginController } from '../modules/login/presentation/LoginController';
import { PacientesController } from '../modules/pacientes/presentation/PacienteController';
import { PersonalController } from '../modules/registropersonal/presentation/PersonalController';
import { HorarioController } from '../modules/registro-horario/presentation/HorarioController'; 
import { CitaController } from '../modules/citas/presentation/CitaController';

// 🎯 CORRECCIÓN DE RUTAS: Apuntamos al nuevo módulo de diagnosticos
import { ConsultaController } from '../modules/diagnosticos/presentation/ConsultaController';
import { FarmaciaController } from '../modules/farmacia/presentation/FarmaciaController';

import { LoginService } from '../modules/login/application/LoginService';
import { ActualizarPasswordInicialService } from '../modules/login/application/ActualizarPasswordService';
import { CambiarPasswordPerfilService } from '../modules/login/application/CambiarPasswordPerfilService';
import { HorarioService } from '../modules/registro-horario/application/HorarioService';
import { ActualizarPasswordController } from '../modules/login/presentation/ActualizarPasswordController';
import { PacienteService } from '../modules/pacientes/application/PacienteService';
import { RegistrarPersonalService } from '../modules/registropersonal/application/RegistrarPersonalService';
import { CitaService } from '../modules/citas/application/CitaService';

// 🎯 CORRECCIÓN DE RUTAS: Servicio de la aplicación cambiado a diagnosticos
import { ConsultaService } from '../modules/diagnosticos/application/ConsultaService';
import { FarmaciaService } from '../modules/farmacia/application/FarmaciaService';

import { RepositoryFactory, MysqlRepositoryFactory } from './RepositoryFactory';

export interface ModuleBundle {
    controladorLogin: LoginController;
    controladorActualizarPassword: ActualizarPasswordController;
    controladorPacientes: PacientesController;
    controladorPersonal: PersonalController;
    controladorHorarios: HorarioController; 
    controladorCitas: CitaController;
    controladorConsultas: ConsultaController;
    controladorFarmacia: FarmaciaController;
}

export abstract class AbstractModuleFactory {
    protected abstract repoFactory: RepositoryFactory;

    abstract crearLoginModule(): LoginController;
    abstract crearActualizarPasswordModule(): ActualizarPasswordController;
    abstract crearPacientesModule(): PacientesController;
    abstract crearPersonalModule(): PersonalController;
    abstract crearHorariosModule(): HorarioController; 
    abstract crearCitasModule(): CitaController;
    abstract crearConsultasModule(): ConsultaController;
    abstract crearFarmaciaModule(): FarmaciaController;

    public construirTodosLosModulos(): ModuleBundle {
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

export class MysqlModuleFactory extends AbstractModuleFactory {
    protected repoFactory: RepositoryFactory;

    constructor(private readonly dataSource: DataSource) {
        super();
        this.repoFactory = new MysqlRepositoryFactory(this.dataSource);
    }

    crearLoginModule(): LoginController {
        const repo = this.repoFactory.crearLoginRepository();
        const service = new LoginService(repo);
        return new LoginController(service);
    }

    crearActualizarPasswordModule(): ActualizarPasswordController {
        const repo = this.repoFactory.crearLoginRepository(); 
        const serviceInicial = new ActualizarPasswordInicialService(repo);
        const servicePerfil = new CambiarPasswordPerfilService(repo); 
        return new ActualizarPasswordController(serviceInicial, servicePerfil); 
    }

    crearPacientesModule(): PacientesController {
        const repo = this.repoFactory.crearPacienteRepository();
        const service = new PacienteService(repo);
        return new PacientesController(service);
    }

    crearPersonalModule(): PersonalController {
        const repo = this.repoFactory.crearPersonalRepository();
        const service = new RegistrarPersonalService(repo);
        return new PersonalController(service);
    }

    crearHorariosModule(): HorarioController {
        const repoHorarios = this.repoFactory.crearHorarioRepository(); 
        const servicioHorarios = new HorarioService(repoHorarios); 
        return new HorarioController(servicioHorarios); 
    }

    crearCitasModule(): CitaController {
        const repoCitas = this.repoFactory.crearCitaRepository();
        const repoHorarios = this.repoFactory.crearHorarioRepository();
        const servicioCitas = new CitaService(repoCitas, repoHorarios);
        return new CitaController(servicioCitas);
    }

    crearConsultasModule(): ConsultaController {
        // 🚀 Ahora llamará nativamente al nuevo método limpio de RepositoryFactory.ts
        const repoConsultas = this.repoFactory.crearConsultaRepository();
        const servicioConsultas = new ConsultaService(repoConsultas);
        return new ConsultaController(servicioConsultas);
    }

    crearFarmaciaModule(): FarmaciaController {
        const repoFarmacia = this.repoFactory.crearFarmaciaRepository();
        const servicioFarmacia = new FarmaciaService(repoFarmacia);
        return new FarmaciaController(servicioFarmacia);
    }
}