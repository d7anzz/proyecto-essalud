import { Usuario } from '../domain/Usuario';
import { UsuarioModel } from './UsuarioModel';
export declare class UsuarioMapper {
    static toDomain(model: UsuarioModel): Usuario;
    static toPersistence(entity: Usuario): Partial<UsuarioModel>;
}
//# sourceMappingURL=UsuarioMapper.d.ts.map