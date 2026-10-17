"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRoutes = void 0;
const express_1 = require("express");
const LoginRoutes = (loginController, actualizarPasswordController) => {
    const router = (0, express_1.Router)();
    // 🚪 1. Autenticación de usuarios
    router.post('/login', loginController.login);
    // 🔑 2. Cambio obligatorio en el primer inicio de sesión
    router.post('/actualizar-password-inicial', (req, res) => actualizarPasswordController.manejar(req, res));
    // 🪪 3. INTEGRADO: Cambio voluntario de contraseña desde "Mi Perfil"
    router.post('/cambiar-password', (req, res) => actualizarPasswordController.manejarCambioPerfil(req, res));
    return router;
};
exports.LoginRoutes = LoginRoutes;
//# sourceMappingURL=LoginRoutes.js.map