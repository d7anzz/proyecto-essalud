import { DataSource } from 'typeorm';
import { FarmaciaRepository } from '../domain/FarmaciaRepository';
import { Medicamento } from '../domain/Medicamento';
export declare class MysqlFarmaciaRepository implements FarmaciaRepository {
    private readonly dataSource;
    private readonly repoMedicamento;
    constructor(dataSource: DataSource);
    listarInventario(): Promise<Medicamento[]>;
    ingresarMedicamento(medicamento: Medicamento): Promise<Medicamento>;
    listarRecetasPendientes(dniPaciente?: string): Promise<any[]>;
    despacharRecetaTransaccional(idOrden: number, idMedicamento: number, cantidadEntregada: number): Promise<void>;
}
//# sourceMappingURL=MysqlFarmaciaRepository.d.ts.map