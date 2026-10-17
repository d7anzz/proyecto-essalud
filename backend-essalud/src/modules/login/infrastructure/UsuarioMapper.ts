import { Usuario } from '../domain/Usuario';
import { UsuarioModel } from './UsuarioModel';

export class UsuarioMapper {
    static toDomain(model: UsuarioModel): Usuario {
        return new Usuario(
            model.dni,                     
            model.username,                
            model.passwordHash,            
            model.idRol,                   
            model.estado,                  
            model.intentosFallidos,        
            !!model.requiereCambioPassword 
        );
    }
    public static toPersistence(entity: Usuario): Partial<UsuarioModel> {
        return {
            dni: entity.dni,
            username: entity.username,
            passwordHash: entity.passwordHash,
            idRol: entity.idRol,
            estado: entity.estado,
            intentosFallidos: entity.intentosFallidos,
            requiereCambioPassword: entity.requiereCambioPassword
        };
    }
}