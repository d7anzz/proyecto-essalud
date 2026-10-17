import { DataSource } from 'typeorm';
import { LoginRepository } from '../modules/login/domain/LoginRepository';
import { PacienteRepository } from '../modules/pacientes/domain/PacienteRepository';
import { PersonalRepository } from '../modules/registropersonal/domain/PersonalRepository';
import { HorarioRepository } from '../modules/registro-horario/domain/HorarioRepository';
import { CitaRepository } from '../modules/citas/domain/CitaRepository';
import { ConsultaRepository } from '../modules/diagnosticos/domain/ConsultaRepository';
import { FarmaciaRepository } from '../modules/farmacia/domain/FarmaciaRepository';
export declare abstract class RepositoryFactory {
    abstract crearLoginRepository(): LoginRepository;
    abstract crearPacienteRepository(): PacienteRepository;
    abstract crearPersonalRepository(): PersonalRepository;
    abstract crearHorarioRepository(): HorarioRepository;
    abstract crearCitaRepository(): CitaRepository;
    abstract crearConsultaRepository(): ConsultaRepository;
    abstract crearFarmaciaRepository(): FarmaciaRepository;
}
export declare class MysqlRepositoryFactory extends RepositoryFactory {
    private readonly db;
    constructor(db: DataSource);
    crearLoginRepository(): LoginRepository;
    crearPacienteRepository(): PacienteRepository;
    crearPersonalRepository(): PersonalRepository;
    crearHorarioRepository(): HorarioRepository;
    crearCitaRepository(): CitaRepository;
    crearConsultaRepository(): ConsultaRepository;
    crearFarmaciaRepository(): FarmaciaRepository;
}
//# sourceMappingURL=RepositoryFactory.d.ts.map