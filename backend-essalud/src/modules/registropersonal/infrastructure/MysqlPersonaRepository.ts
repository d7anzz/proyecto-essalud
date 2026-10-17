import { DataSource } from 'typeorm'; 
import { PersonalRepository } from '../domain/PersonalRepository';
import { Personal } from '../domain/Personal';
import { Usuario } from '../../login/domain/Usuario';
import { PersonalModel } from './PersonalModel';
import { UsuarioModel } from '../../login/infrastructure/UsuarioModel';
import { PersonalMapper } from './PersonalMapper';
import { UsuarioMapper } from '../../login/infrastructure/UsuarioMapper';

export class MysqlPersonalRepository implements PersonalRepository {
  private readonly personalRepo;
  private readonly usuarioRepo;

  constructor(private readonly dataSource: DataSource) {
    this.personalRepo = this.dataSource.getRepository(PersonalModel);
    this.usuarioRepo = this.dataSource.getRepository(UsuarioModel);
  }

  async existePorDni(dni: string): Promise<boolean> {
    const dniLimpio = dni.trim();
    const registro = await this.personalRepo.findOne({ where: { dni: dniLimpio } });
    return registro !== null;
  }

  async obtenerEspecialidadPorDni(dni: string): Promise<number | null> {
    const dniLimpio = dni.trim();

    const personal = await this.personalRepo.findOne({ 
      where: { dni: dniLimpio },
      relations: { especialidad: true }
    });
    
    if (!personal) {
      return null;
    }

    return personal.idEspecialidad ? Number(personal.idEspecialidad) : null;
  }

  async guardarPersonalYCredenciales(usuario: Usuario, personal: Personal): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usuarioModel = UsuarioMapper.toPersistence(usuario);
      const personalModel = PersonalMapper.toPersistence(personal);

      await queryRunner.manager.save(UsuarioModel, usuarioModel);
      await queryRunner.manager.save(PersonalModel, personalModel);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}