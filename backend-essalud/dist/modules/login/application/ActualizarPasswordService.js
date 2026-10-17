"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActualizarPasswordInicialService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class ActualizarPasswordInicialService {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async ejecutar(data) {
        const usuario = await this.authRepository.buscarPorDni(data.dni);
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const nuevoHash = await bcryptjs_1.default.hash(data.nuevaPassword, salt);
        usuario.actualizarPasswordInicial(nuevoHash);
        await this.authRepository.actualizarEstado(usuario);
    }
}
exports.ActualizarPasswordInicialService = ActualizarPasswordInicialService;
//# sourceMappingURL=ActualizarPasswordService.js.map