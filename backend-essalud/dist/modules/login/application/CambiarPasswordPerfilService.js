"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CambiarPasswordPerfilService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class CambiarPasswordPerfilService {
    authRepository;
    // Inyectamos la interfaz del repositorio de dominio de manera ordenada
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async ejecutar(dto) {
        // 1. Buscar al operador en MySQL usando tu repositorio de dominio
        const usuario = await this.authRepository.buscarPorDni(dto.dni);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        // 2. Verificar criptográficamente la contraseña actual usando bcryptjs
        const esValida = await bcryptjs_1.default.compare(dto.passwordActual, usuario.passwordHash);
        if (!esValida) {
            throw new Error('La contraseña actual ingresada es incorrecta.');
        }
        // 3. Cifrar la nueva contraseña voluntaria
        const salt = await bcryptjs_1.default.genSalt(10);
        const nuevoHash = await bcryptjs_1.default.hash(dto.passwordNueva, salt);
        // 4. Modificar el estado de la entidad mediante su método encapsulado público
        // Esto evita el error de asignación directa sobre propiedades protegidas o de solo lectura
        usuario.actualizarPasswordInicial(nuevoHash);
        // 5. PERSISTENCIA REAL: Sincronizamos la entidad de dominio mutada con la base de datos
        await this.authRepository.actualizarEstado(usuario);
        console.log(`✅ Contraseña guardada con éxito en MySQL mediante Repositorio de Dominio para DNI: ${dto.dni}`);
    }
}
exports.CambiarPasswordPerfilService = CambiarPasswordPerfilService;
//# sourceMappingURL=CambiarPasswordPerfilService.js.map