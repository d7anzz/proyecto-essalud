import { DataSource } from 'typeorm';
export declare class DatabaseSingleton {
    private static instancia;
    private readonly dataSource;
    /**
     * Constructor privado: impide instanciar la clase con "new"
     * desde fuera. Solo getInstance() puede crear el objeto.
     */
    private constructor();
    /**
     * Punto de acceso global a la instancia.
     * Si no existe → la crea.
     * Si ya existe → devuelve la misma.
     */
    static getInstance(): DatabaseSingleton;
    /** Expone el DataSource de TypeORM para que los repositorios obtengan sus repos. */
    getDataSource(): DataSource;
    /** Inicializa la conexión solo si aún no ha sido inicializada. */
    inicializar(): Promise<void>;
}
//# sourceMappingURL=DatabaseSingleton.d.ts.map