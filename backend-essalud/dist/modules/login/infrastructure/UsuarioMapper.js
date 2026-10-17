"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioMapper = void 0;
const Usuario_1 = require("../domain/Usuario");
class UsuarioMapper {
    static toDomain(model) {
        return new Usuario_1.Usuario(model.dni, model.username, model.passwordHash, model.idRol, model.estado, model.intentosFallidos, !!model.requiereCambioPassword);
    }
    static toPersistence(entity) {
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
exports.UsuarioMapper = UsuarioMapper;
//# sourceMappingURL=UsuarioMapper.js.map