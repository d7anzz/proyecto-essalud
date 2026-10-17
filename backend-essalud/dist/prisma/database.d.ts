import { DataSource } from 'typeorm';
export declare class DatabaseSingleton {
    private static instancia;
    private dataSource;
    private constructor();
    static obtenerInstancia(): DatabaseSingleton;
    conectar(): Promise<void>;
    getDataSource(): DataSource;
}
//# sourceMappingURL=database.d.ts.map