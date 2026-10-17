"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarPersonalService = void 0;
const Personal_1 = require("../domain/Personal");
const Usuario_1 = require("../../login/domain/Usuario");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class RegistrarPersonalService {
    personalRepository;
    ROLES_PERMITIDOS = [2, 4];
    constructor(personalRepository) {
        this.personalRepository = personalRepository;
    }
    async ejecutar(dto, rolEjecutor) {
        if (!this.ROLES_PERMITIDOS.includes(rolEjecutor)) {
            throw new Error('Acceso denegado: Solo el Jefe de Hospital o el personal Administrativo están autorizados para registrar nuevos usuarios.');
        }
        const existePersonal = await this.personalRepository.existePorDni(dto.dni);
        if (existePersonal) {
            throw new Error(`El DNI ${dto.dni} ya se encuentra registrado en el sistema.`);
        }
        const passwordPorDefecto = dto.dni;
        Usuario_1.Usuario.validarPassword(passwordPorDefecto);
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(passwordPorDefecto, salt);
        const credencialesUsuario = new Usuario_1.Usuario(dto.dni, dto.username, passwordHash, dto.idRol, 1, 0, true);
        const nuevoPersonal = new Personal_1.Personal(dto.dni, dto.nombre, dto.apellidos, dto.idRol, dto.colegiatura || null, dto.idEspecialidad || null);
        await this.personalRepository.guardarPersonalYCredenciales(credencialesUsuario, nuevoPersonal);
    }
}
exports.RegistrarPersonalService = RegistrarPersonalService;
//# sourceMappingURL=RegistrarPersonalService.js.map