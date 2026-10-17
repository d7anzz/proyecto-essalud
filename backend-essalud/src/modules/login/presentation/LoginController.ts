import { Request, Response } from 'express';
import { LoginService } from '../application/LoginService';
import { LoginDTO } from '../application/LoginDTO';

export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const data: LoginDTO = req.body || {};
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
        } catch (error: any) {
            res.status(401).json({ 
                message: error.message || 'Error en el proceso de autenticación.' 
            });
        }
    };
}