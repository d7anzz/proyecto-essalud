"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSingleton = void 0;
const database_1 = require("./database");
class DatabaseSingleton {
    // Única instancia estática almacenada en la clase
    static instancia = null;
    // DataSource privado; solo accesible vía getDataSource()
    dataSource;
    /**
     * Constructor privado: impide instanciar la clase con "new"
     * desde fuera. Solo getInstance() puede crear el objeto.
     */
    constructor() {
        this.dataSource = database_1.AppDataSource;
    }
    /**
     * Punto de acceso global a la instancia.
     * Si no existe → la crea.
     * Si ya existe → devuelve la misma.
     */
    static getInstance() {
        if (!DatabaseSingleton.instancia) {
            console.log('[Singleton] Creando única instancia de DatabaseSingleton...');
            DatabaseSingleton.instancia = new DatabaseSingleton();
        }
        else {
            console.log('[Singleton] Reutilizando instancia existente de DatabaseSingleton.');
        }
        return DatabaseSingleton.instancia;
    }
    /** Expone el DataSource de TypeORM para que los repositorios obtengan sus repos. */
    getDataSource() {
        return this.dataSource;
    }
    /** Inicializa la conexión solo si aún no ha sido inicializada. */
    async inicializar() {
        if (!this.dataSource.isInitialized) {
            await this.dataSource.initialize();
            console.log('[Singleton] ✅ Conexión a MySQL establecida correctamente.');
        }
    }
}
exports.DatabaseSingleton = DatabaseSingleton;
//# sourceMappingURL=DatabaseSingleton.js.map