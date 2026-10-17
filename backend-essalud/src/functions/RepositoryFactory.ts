import { DataSource } from 'typeorm'; 
import { LoginRepository } from '../modules/login/domain/LoginRepository';
import { PacienteRepository } from '../modules/pacientes/domain/PacienteRepository';
import { PersonalRepository } from '../modules/registropersonal/domain/PersonalRepository';
import { HorarioRepository } from '../modules/registro-horario/domain/HorarioRepository'; 
import { CitaRepository } from '../modules/citas/domain/CitaRepository';

// 🎯 NUEVAS IMPORTACIONES DE CONTRATOS (DOMAIN)
import { ConsultaRepository } from '../modules/diagnosticos/domain/ConsultaRepository';
import { FarmaciaRepository } from '../modules/farmacia/domain/FarmaciaRepository';

import { MysqlLoginRepository } from '../modules/login/infrastructure/MysqlLoginRepository';
import { MysqlPacienteRepository } from '../modules/pacientes/infrastructure/MysqlPacienteRepository';
import { MysqlPersonalRepository } from '../modules/registropersonal/infrastructure/MysqlPersonaRepository';
import { MysqlHorarioRepository } from '../modules/registro-horario/infrastructure/MysqlHorarioRepository'; 
import { MysqlCitaRepository } from '../modules/citas/infrastructure/MysqlCitaRepository';

import { MysqlConsultaRepository } from '../modules/diagnosticos/infrastructure/MysqlConsultaRepository';
import { MysqlFarmaciaRepository } from '../modules/farmacia/infrastructure/MysqlFarmaciaRepository';

import { PacienteModel } from '../modules/pacientes/infrastructure/PacienteModel';
import { UsuarioModel } from '../modules/login/infrastructure/UsuarioModel';

export abstract class RepositoryFactory {
    abstract crearLoginRepository(): LoginRepository;
    abstract crearPacienteRepository(): PacienteRepository;
    abstract crearPersonalRepository(): PersonalRepository;
    abstract crearHorarioRepository(): HorarioRepository; 
    abstract crearCitaRepository(): CitaRepository;
    
    // 🎯 NUEVOS CONTRATOS ABSTRACTOS REGISTRADOS
    abstract crearConsultaRepository(): ConsultaRepository;
    abstract crearFarmaciaRepository(): FarmaciaRepository;
}

export class MysqlRepositoryFactory extends RepositoryFactory {
    
    constructor(private readonly db: DataSource) {
        super();
    }

    crearLoginRepository(): LoginRepository {
        const ormRepo = this.db.getRepository(UsuarioModel);
        return new MysqlLoginRepository(ormRepo);
    }

    crearPacienteRepository(): PacienteRepository {
        const ormRepo = this.db.getRepository(PacienteModel);
        return new MysqlPacienteRepository(ormRepo);
    }

    crearPersonalRepository(): PersonalRepository {
        return new MysqlPersonalRepository(this.db);
    }

    crearHorarioRepository(): HorarioRepository {
        return new MysqlHorarioRepository(this.db);
    }

    crearCitaRepository(): CitaRepository {
        return new MysqlCitaRepository(this.db);
    }

    // 🩺 IMPLEMENTACIÓN PARA EL MÓDULO DE DIAGNÓSTICOS
    crearConsultaRepository(): ConsultaRepository {
        return new MysqlConsultaRepository(this.db);
    }

    // 💊 IMPLEMENTACIÓN PARA EL MÓDULO DE INVENTARIO Y ENTREGAS
    crearFarmaciaRepository(): FarmaciaRepository {
        return new MysqlFarmaciaRepository(this.db);
    }
}