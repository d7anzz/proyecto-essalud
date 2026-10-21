import { DataSource } from 'typeorm';
import { PacienteModel } from '../modules/pacientes/infrastructure/PacienteModel';
import { UsuarioModel } from '../modules/login/infrastructure/UsuarioModel';
import { PersonalModel, EspecialidadInline } from '../modules/registropersonal/infrastructure/PersonalModel';
import { HorarioModel } from '../modules/registro-horario/infrastructure/HorarioModel';
import { CitaModel } from '../modules/citas/infrastructure/CitaModel';
import { ConsultaModel } from '../modules/diagnosticos/infrastructure/ConsultaModel';
import { MedicamentoModel } from '../modules/farmacia/infrastructure/MedicamentoModel';
import { OrdenMedicamentoModel } from '../modules/farmacia/infrastructure/OrdenMedicamentoModel';

export class DatabaseSingleton {
  private static instancia: DatabaseSingleton | null = null;
  private dataSource: DataSource;

  private constructor() {
    this.dataSource = new DataSource({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'Darikson1905@', 
      database: 'essalud_db',
      synchronize: false, 
      logging: false,
      // 🚀 REGISTRAMOS LOS NUEVOS COMPONENTES DE INFRAESTRUCTURA AQUÍ:
      entities: [
        PacienteModel, 
        UsuarioModel, 
        PersonalModel, 
        EspecialidadInline, 
        HorarioModel, 
        CitaModel,
        ConsultaModel,       // 🩺 Tabla consultas_medicas
        MedicamentoModel,     // 📦 Tabla medicamentos
        OrdenMedicamentoModel // 💊 Tabla ordenes_medicamentos
      ],
    });
  }

  public static obtenerInstancia(): DatabaseSingleton {
    if (!DatabaseSingleton.instancia) {
      DatabaseSingleton.instancia = new DatabaseSingleton();
    }
    return DatabaseSingleton.instancia;
  }

  public async conectar(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }
}