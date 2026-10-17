import { DataSource, Repository } from 'typeorm';
import { HorarioRepository } from '../domain/HorarioRepository';
import { Horario } from '../domain/Horario'; 
import { HorarioModel } from './HorarioModel';
import { HorarioMapper } from './HorarioMapper';

export class MysqlHorarioRepository implements HorarioRepository {
  private readonly repo: Repository<HorarioModel>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(HorarioModel);
  }

  async crear(horario: Horario): Promise<Horario> {
    try {
      const rawData = HorarioMapper.toPersistence(horario);
      
      if (rawData.id === 0 || !rawData.id) {
        delete rawData.id;
      }

      const model = this.repo.create(rawData);
      const saved = await this.repo.save(model);
      
      const refetched = await this.repo.findOneBy({ id: saved.id });
      return HorarioMapper.toDomain(refetched || saved);
    } catch (error) {
      console.error('💥 [TypeORM Error] Fallo al insertar horario en la base de datos:', error);
      throw new Error('Error interno al registrar el horario en MySQL.');
    }
  }

  async listar(): Promise<Horario[]> {
    try {
      const models = await this.repo.find({
        relations: {
          personal: {
            especialidad: true
          }
        }
      });
      return models.map(HorarioMapper.toDomain);
    } catch (error) {
      console.error('💥 [TypeORM Error] Fallo al listar horarios con especialidades:', error);
      throw new Error('Error interno al recuperar los horarios.');
    }
  }

  async obtenerPorId(id: number): Promise<Horario | null> {
    const model = await this.repo.findOneBy({ id });
    return model ? HorarioMapper.toDomain(model) : null;
  }

  async actualizar(id: number, datos: Partial<Horario>): Promise<Horario | null> {
    try {
      const rawData = HorarioMapper.toPersistence(datos as Horario);
      
      delete rawData.id;
      delete (rawData as any).personal; 

      await this.repo.update(id, rawData);
      
      return this.obtenerPorId(id);
    } catch (error) {
      console.error(`💥 [TypeORM Error] Fallo al actualizar el horario ${id}:`, error);
      throw error;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async buscarPorMedicoYFecha(dni: string, fecha: string): Promise<Horario[]> {
    try {
      const models = await this.repo.find({
        where: { dni, fecha }
      });
      return models.map(HorarioMapper.toDomain);
    } catch (error) {
      console.error('💥 [TypeORM Error] Fallo al buscar horarios por médico y fecha:', error);
      throw new Error('Error interno al verificar duplicados en la base de datos.');
    }
  }
}