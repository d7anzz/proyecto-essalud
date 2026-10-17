import { DataSource, Repository } from 'typeorm';
import { CitaRepository } from '../domain/CitaRepository';
import { Cita } from '../domain/Cita';
import { CitaModel } from './CitaModel';
import { CitaMapper } from './CitaMapper';

export class MysqlCitaRepository implements CitaRepository {
  private readonly repo: Repository<CitaModel>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(CitaModel);
  }

  async crear(cita: Cita): Promise<Cita> {
    const rawData = CitaMapper.toPersistence(cita);
    if (rawData.idCita === 0 || !rawData.idCita) {
      delete rawData.idCita;
    }
    const model = this.repo.create(rawData);
    const saved = await this.repo.save(model);
    return this.obtenerPorId(saved.idCita) as Promise<Cita>;
  }

  async listar(): Promise<Cita[]> {
    const data = await this.repo.find({
      relations: {
        paciente: true,
        horario: {
          personal: {
            especialidad: true
          }
        }
      }
    });
    return data.map(CitaMapper.toDomain);
  }

  async obtenerPorId(id: number): Promise<Cita | null> {
    const data = await this.repo.findOne({
      where: { idCita: id },
      relations: {
        paciente: true,
        horario: {
          personal: {
            especialidad: true
          }
        }
      }
    });
    return data ? CitaMapper.toDomain(data) : null;
  }

  async actualizar(id: number, datos: Partial<Cita>): Promise<Cita | null> {
    const rawData = CitaMapper.toPersistence(datos as Cita);
    delete rawData.idCita;
    await this.repo.update({ idCita: id }, rawData);
    return this.obtenerPorId(id);
  }

  async eliminar(id: number): Promise<boolean> {
    const res = await this.repo.delete({ idCita: id });
    return (res.affected ?? 0) > 0;
  }
}