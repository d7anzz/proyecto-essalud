"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarJWT = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const verificarJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[AuthMiddleware] Acceso rechazado: Token no enviado o formato inválido.');
        res.status(401).json({
            message: 'Acceso denegado: No se proporcionó un token válido.'
        });
        return;
    }
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
        console.log('[AuthMiddleware] Acceso rechazado: Token vacío.');
        res.status(401).json({
            message: 'Acceso denegado: Token vacío.'
        });
        return;
    }
    try {
        const claveSecreta = process.env.JWT_SECRET || 'essalud_secret_key_2026';
        console.log('[AuthMiddleware] Validando firma del token recibido...');
        const payloadDecodificado = jwt.verify(token, claveSecreta);
        console.log('[AuthMiddleware] Token verificado con éxito.');
        console.log('Datos decodificados dentro del JWT:', payloadDecodificado);
        req.user = payloadDecodificado;
        next();
    }
    catch (error) {
        console.error('[AuthMiddleware] ERROR DE VALIDACIÓN:', error.message);
        res.status(401).json({
            message: 'Acceso denegado: El token de autenticación es inválido o ha expirado.',
            error_real: error.message
        });
    }
};
exports.verificarJWT = verificarJWT;
//# sourceMappingURL=authMiddleware.js.map