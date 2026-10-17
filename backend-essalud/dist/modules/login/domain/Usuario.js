"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
class Usuario {
    dni;
    username;
    passwordHash;
    idRol;
    estado;
    intentosFallidos;
    requiereCambioPassword;
    constructor(dni, username, passwordHash, // Se queda readonly para protegerlo externamente
    idRol, estado, intentosFallidos, requiereCambioPassword) {
        this.dni = dni;
        this.username = username;
        this.passwordHash = passwordHash;
        this.idRol = idRol;
        this.estado = estado;
        this.intentosFallidos = intentosFallidos;
        this.requiereCambioPassword = requiereCambioPassword;
    }
    static validarPassword(password) {
        if (!password || password.length < 8) {
            throw new Error('La contraseña debe tener un mínimo de 8 caracteres.');
        }
    }
    estaActivo() {
        return this.estado === 1;
    }
    registrarIntentoFallido() {
        this.intentosFallidos += 1;
        if (this.intentosFallidos >= 3) {
            this.estado = 0;
        }
    }
    limpiarIntentos() {
        this.intentosFallidos = 0;
    }
    actualizarPasswordInicial(nuevoHash) {
        this.passwordHash = nuevoHash;
        this.requiereCambioPassword = false;
    }
}
exports.Usuario = Usuario;
//# sourceMappingURL=Usuario.js.map