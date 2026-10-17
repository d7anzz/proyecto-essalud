export class Usuario {
    constructor(
        public readonly dni: string,              
        public readonly username: string,          
        public readonly passwordHash: string, // Se queda readonly para protegerlo externamente
        public readonly idRol: number,
        public estado: number,                     
        public intentosFallidos: number,
        public requiereCambioPassword: boolean
    ) {}

    public static validarPassword(password: string): void {
        if (!password || password.length < 8) {
            throw new Error('La contraseña debe tener un mínimo de 8 caracteres.');
        }
    }

    public estaActivo(): boolean {
        return this.estado === 1;
    }

    public registrarIntentoFallido(): void {
        this.intentosFallidos += 1;
        if (this.intentosFallidos >= 3) {
            this.estado = 0; 
        }
    }

    public limpiarIntentos(): void {
        this.intentosFallidos = 0;
    }

    public actualizarPasswordInicial(nuevoHash: string): void {
        (this as any).passwordHash = nuevoHash;
        this.requiereCambioPassword = false;
    }
}