import { Repository } from 'typeorm';
import { LoginRepository } from '../domain/LoginRepository';
import { Usuario } from '../domain/Usuario';
import { UsuarioModel } from './UsuarioModel';
export declare class MysqlLoginRepository implements LoginRepository {
    private readonly repo;
    constructor(repo: Repository<UsuarioModel>);
    buscarPorDni(dni: string): Promise<Usuario | null>;
    actualizarEstado(usuario: Usuario): Promise<void>;
}
//# sourceMappingURL=MysqlLoginRepository.d.ts.map