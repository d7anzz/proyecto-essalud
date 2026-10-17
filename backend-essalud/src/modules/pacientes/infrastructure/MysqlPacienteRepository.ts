import { Repository, Like } from 'typeorm';
import { Paciente } from '../domain/Paciente';
import { PacienteRepository } from '../domain/PacienteRepository';
import { PacienteModel } from './PacienteModel';
import { PacienteMapper } from './PacienteMapper';

export class MysqlPacienteRepository implements PacienteRepository {
  constructor(private ormRepository: Repository<PacienteModel>) {}

  async guardar(paciente: Paciente): Promise<void> {
    const modeloBD = PacienteMapper.toPersistence(paciente);
    await this.ormRepository.save(modeloBD);
  }

  async buscarPorDni(dni: string): Promise<Paciente | null> {
    const modeloBD = await this.ormRepository.findOne({ where: { dni } });
    if (!modeloBD) return null;
    return PacienteMapper.toDomain(modeloBD);
  }

  async buscarCoincidenciasPorDni(dni: string): Promise<Paciente[]> {
    const modelosBD = await this.ormRepository.find({
      where: {
        dni: Like(`${dni}%`)
      },
      take: 8
    });
    return modelosBD.map(modelo => PacienteMapper.toDomain(modelo));
  }

  async obtenerTodos(): Promise<Paciente[]> {
    const modelosBD = await this.ormRepository.find();
    return modelosBD.map(modelo => PacienteMapper.toDomain(modelo));
  }

  async eliminarPorDni(dni: string): Promise<void> {
    await this.ormRepository.delete({ dni });
  }
}