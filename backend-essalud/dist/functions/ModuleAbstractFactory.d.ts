import { DataSource } from 'typeorm';
import { LoginController } from '../modules/login/presentation/LoginController';
import { PacientesController } from '../modules/pacientes/presentation/PacienteController';
import { PersonalController } from '../modules/registropersonal/presentation/PersonalController';
import { HorarioController } from '../modules/registro-horario/presentation/HorarioController';
import { CitaController } from '../modules/citas/presentation/CitaController';
import { ConsultaController } from '../modules/diagnosticos/presentation/ConsultaController';
import { FarmaciaController } from '../modules/farmacia/presentation/FarmaciaController';
import { ActualizarPasswordController } from '../modules/login/presentation/ActualizarPasswordController';
import { RepositoryFactory } from './RepositoryFactory';
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
export declare abstract class AbstractModuleFactory {
    protected abstract repoFactory: RepositoryFactory;
    abstract crearLoginModule(): LoginController;
    abstract crearActualizarPasswordModule(): ActualizarPasswordController;
    abstract crearPacientesModule(): PacientesController;
    abstract crearPersonalModule(): PersonalController;
    abstract crearHorariosModule(): HorarioController;
    abstract crearCitasModule(): CitaController;
    abstract crearConsultasModule(): ConsultaController;
    abstract crearFarmaciaModule(): FarmaciaController;
    construirTodosLosModulos(): ModuleBundle;
}
export declare class MysqlModuleFactory extends AbstractModuleFactory {
    private readonly dataSource;
    protected repoFactory: RepositoryFactory;
    constructor(dataSource: DataSource);
    crearLoginModule(): LoginController;
    crearActualizarPasswordModule(): ActualizarPasswordController;
    crearPacientesModule(): PacientesController;
    crearPersonalModule(): PersonalController;
    crearHorariosModule(): HorarioController;
    crearCitasModule(): CitaController;
    crearConsultasModule(): ConsultaController;
    crearFarmaciaModule(): FarmaciaController;
}
//# sourceMappingURL=ModuleAbstractFactory.d.ts.map