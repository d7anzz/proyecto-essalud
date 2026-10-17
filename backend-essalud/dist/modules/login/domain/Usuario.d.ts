export declare class Usuario {
    readonly dni: string;
    readonly username: string;
    readonly passwordHash: string;
    readonly idRol: number;
    estado: number;
    intentosFallidos: number;
    requiereCambioPassword: boolean;
    constructor(dni: string, username: string, passwordHash: string, // Se queda readonly para protegerlo externamente
    idRol: number, estado: number, intentosFallidos: number, requiereCambioPassword: boolean);
    static validarPassword(password: string): void;
    estaActivo(): boolean;
    registrarIntentoFallido(): void;
    limpiarIntentos(): void;
    actualizarPasswordInicial(nuevoHash: string): void;
}
//# sourceMappingURL=Usuario.d.ts.map