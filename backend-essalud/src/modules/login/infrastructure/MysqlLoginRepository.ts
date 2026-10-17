import { Repository } from 'typeorm'; // Importas Repository de TypeORM
import { LoginRepository } from '../domain/LoginRepository';
import { Usuario } from '../domain/Usuario';
import { UsuarioModel } from './UsuarioModel';
import { UsuarioMapper } from './UsuarioMapper';

export class MysqlLoginRepository implements LoginRepository {
    constructor(private readonly repo: Repository<UsuarioModel>) {}

    async buscarPorDni(dni: string): Promise<Usuario | null> {
        const modeloAsociado = await this.repo.findOne({ where: { dni } });
        
        if (!modeloAsociado) return null;

        return UsuarioMapper.toDomain(modeloAsociado);
    }
    
    async actualizarEstado(usuario: Usuario): Promise<void> {
        const modeloParaPersistir = UsuarioMapper.toPersistence(usuario);
        await this.repo.save(modeloParaPersistir);
    }
}