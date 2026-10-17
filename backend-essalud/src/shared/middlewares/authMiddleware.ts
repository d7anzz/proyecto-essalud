import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken'; 

export const verificarJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[AuthMiddleware] Acceso rechazado: Token no enviado o formato inválido.');

        res.status(401).json({
            message: 'Acceso denegado: No se proporcionó un token válido.'
        });

        return;
    }

    const token: string = authHeader.replace('Bearer ', '').trim();

    if (!token) {
        console.log('[AuthMiddleware] Acceso rechazado: Token vacío.');

        res.status(401).json({
            message: 'Acceso denegado: Token vacío.'
        });

        return;
    }

    try {
        const claveSecreta: string = process.env.JWT_SECRET || 'essalud_secret_key_2026';

        console.log('[AuthMiddleware] Validando firma del token recibido...');

        const payloadDecodificado = jwt.verify(token, claveSecreta);
        
        console.log('[AuthMiddleware] Token verificado con éxito.');
        console.log('Datos decodificados dentro del JWT:', payloadDecodificado);

        (req as any).user = payloadDecodificado;

        next();

    } catch (error: any) {
        console.error('[AuthMiddleware] ERROR DE VALIDACIÓN:', error.message);
        
        res.status(401).json({ 
            message: 'Acceso denegado: El token de autenticación es inválido o ha expirado.',
            error_real: error.message 
        });
    }
};