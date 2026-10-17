// src/modules/personal/domain/Prototype.ts

export interface Prototype<T> {
    /**
     * Retorna una copia exacta (clon) de la instancia actual.
     */
    clone(): T;
}