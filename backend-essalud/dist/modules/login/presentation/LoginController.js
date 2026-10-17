"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
class LoginController {
    loginService;
    constructor(loginService) {
        this.loginService = loginService;
    }
    login = async (req, res) => {
        try {
            const data = req.body || {};
            if (!data.dni || !data.passwordIn) {
                res.status(400).json({
                    message: 'El DNI y la contraseña son obligatorios.'
                });
                return;
            }
            const resultado = await this.loginService.ejecutar(data);
            if (resultado.requiereCambio) {
                res.status(200).json({
                    message: 'Primer inicio de sesión detectado. Debe cambiar su contraseña obligatoriamente antes de continuar.',
                    data: resultado
                });
                return;
            }
            res.status(200).json({
                message: '¡Inicio de sesión exitoso!',
                data: {
                    token: resultado.token,
                    dni: resultado.dni,
                    idRol: resultado.idRol
                }
            });
        }
        catch (error) {
            res.status(401).json({
                message: error.message || 'Error en el proceso de autenticación.'
            });
        }
    };
}
exports.LoginController = LoginController;
//# sourceMappingURL=LoginController.js.map