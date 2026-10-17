import { Request, Response } from 'express';
import { ActualizarPasswordInicialService } from '../application/ActualizarPasswordService';
import { CambiarPasswordPerfilService } from '../application/CambiarPasswordPerfilService'; // 👈 Importamos el nuevo servicio

export class ActualizarPasswordController {
    constructor(
        private readonly actualizarService: ActualizarPasswordInicialService,
        private readonly cambiarPerfilService: CambiarPasswordPerfilService // 👈 Inyectamos el nuevo caso de uso
    ) {}

    // 🔑 1. Método existente para el primer login (Sin cambios)
    manejar = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dni, nuevaPassword } = req.body;

            if (!dni || !nuevaPassword) {
                res.status(400).json({ error: 'El DNI y la nueva contraseña son obligatorios.' });
                return;
            }

            await this.actualizarService.ejecutar({ dni, nuevaPassword });

            res.status(200).json({ 
                message: 'Contraseña inicial actualizada con éxito.' 
            });
        } catch (error: any) {
            res.status(500).json({ 
                error: error.message || 'Error interno al actualizar la contraseña.' 
            });
        }
    };

    // 🪪 2. NUEVO MÉTODO: Controla el cambio de contraseña voluntario desde "Mi Perfil"
    manejarCambioPerfil = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dni, passwordActual, passwordNueva } = req.body;

            // Validación estricta en el controlador (Capítulo HTTP)
            if (!dni || !passwordActual || !passwordNueva) {
                res.status(400).json({ error: 'Todos los campos (DNI, clave actual y clave nueva) son obligatorios.' });
                return;
            }

            // Llamamos a nuestro nuevo caso de uso con la lógica de negocio controlada
            await this.cambiarPerfilService.ejecutar({ dni, passwordActual, passwordNueva });

            res.status(200).json({ 
                message: 'Contraseña actualizada correctamente en el sistema.' 
            });
        } catch (error: any) {
            // Manejo de errores controlado (Si la contraseña es incorrecta o el usuario no existe)
            res.status(401).json({ 
                error: error.message || 'No se pudo procesar el cambio de credenciales.' 
            });
        }
    };
}