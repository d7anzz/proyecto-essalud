"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacientesController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PacientesController {
    pacienteService;
    constructor(pacienteService) {
        this.pacienteService = pacienteService;
    }
    crearPaciente = async (req, res) => {
        try {
            const rolEjecutor = req.user?.id_rol;
            if (!rolEjecutor) {
                res.status(401).json({ error: 'No se pudo identificar la identidad o el rol del usuario.' });
                return;
            }
            const dto = req.body;
            await this.pacienteService.ejecutar(dto, rolEjecutor);
            res.status(201).json({ mensaje: 'Paciente registrado exitosamente' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
    listarPacientes = async (req, res) => {
        try {
            const usuarioAutenticado = req.user;
            if (!usuarioAutenticado) {
                res.status(401).json({ error: 'Acceso denegado: Se requiere un token de autenticación válido.' });
                return;
            }
            const pacientes = await this.pacienteService.listarPacientes();
            const jsonResponse = pacientes.map(paciente => ({
                dni: paciente.dni,
                nombre: paciente.nombre,
                apellidos: paciente.apellidos,
                fec_nac: paciente.fechaNacimiento || paciente.fec_nac
            }));
            res.status(200).json(jsonResponse);
        }
        catch (error) {
            res.status(500).json({ error: 'Error interno al obtener la lista de pacientes: ' + error.message });
        }
    };
    buscarPorDni = async (req, res) => {
        try {
            const usuarioAutenticado = req.user;
            if (!usuarioAutenticado) {
                res.status(401).json({ error: 'Acceso denegado: Se requiere un token de autenticación válido.' });
                return;
            }
            const dni = req.params.dni;
            const pacientes = await this.pacienteService.buscarPorDni(dni);
            const jsonResponse = pacientes.map(paciente => ({
                dni: paciente.dni,
                nombre: paciente.nombre,
                apellidos: paciente.apellidos,
                fec_nac: paciente.fechaNacimiento || paciente.fec_nac
            }));
            res.status(200).json({ ok: true, data: jsonResponse });
        }
        catch (error) {
            res.status(400).json({ ok: false, error: error.message });
        }
    };
    actualizarPaciente = async (req, res) => {
        try {
            const dni = req.params.dni;
            const { passwordOperador, ...dto } = req.body;
            const usuarioOperador = req.user;
            if (!usuarioOperador || !passwordOperador) {
                res.status(400).json({ error: 'La contraseña de confirmación del operador es obligatoria.' });
                return;
            }
            const hashOperador = usuarioOperador.password || usuarioOperador.passwordHash;
            if (hashOperador) {
                const esValido = await bcryptjs_1.default.compare(passwordOperador, hashOperador);
                if (!esValido) {
                    res.status(403).json({ error: 'Contraseña de confirmación incorrecta. Operación cancelada por seguridad.' });
                    return;
                }
            }
            else {
                console.log('ℹ️ [Controlador] Modificación autorizada por firma digital JWT del operador.');
            }
            await this.pacienteService.actualizarPaciente(dni, dto);
            res.status(200).json({ mensaje: 'Datos del paciente actualizados correctamente' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
    eliminarPaciente = async (req, res) => {
        try {
            const dni = req.params.dni;
            const { passwordOperador } = req.body;
            const usuarioOperador = req.user;
            if (!usuarioOperador || !passwordOperador) {
                res.status(400).json({ error: 'Se requiere su contraseña personal para autorizar la eliminación.' });
                return;
            }
            const hashOperador = usuarioOperador.password || usuarioOperador.passwordHash;
            if (hashOperador) {
                const esValido = await bcryptjs_1.default.compare(passwordOperador, hashOperador);
                if (!esValido) {
                    res.status(403).json({ error: 'Contraseña de confirmación incorrecta. No se pudo eliminar al paciente.' });
                    return;
                }
            }
            else {
                console.log('ℹ️ [Controlador] Eliminación autorizada por firma digital JWT del operador.');
            }
            await this.pacienteService.eliminarPaciente(dni);
            res.status(200).json({ mensaje: 'Paciente eliminado exitosamente del sistema' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
}
exports.PacientesController = PacientesController;
//# sourceMappingURL=PacienteController.js.map