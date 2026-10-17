import { Router } from 'express';
import { LoginController } from './LoginController';
import { ActualizarPasswordController } from './ActualizarPasswordController';

export const LoginRoutes = (
    loginController: LoginController,
    actualizarPasswordController: ActualizarPasswordController
): Router => {
    const router = Router();

    // 🚪 1. Autenticación de usuarios
    router.post('/login', loginController.login);
    
    // 🔑 2. Cambio obligatorio en el primer inicio de sesión
    router.post('/actualizar-password-inicial', (req, res) => actualizarPasswordController.manejar(req, res));

    // 🪪 3. INTEGRADO: Cambio voluntario de contraseña desde "Mi Perfil"
    router.post('/cambiar-password', (req, res) => actualizarPasswordController.manejarCambioPerfil(req, res));

    return router;
};