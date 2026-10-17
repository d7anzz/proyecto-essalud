import { FarmaciaRepository } from '../domain/FarmaciaRepository';
import { Medicamento } from '../domain/Medicamento';
import { IngresarMedicamentoDTO } from './IngresarMedicamentoDTO';
import { DespacharRecetaDTO } from './DespacharRecetaDTO';
export declare class FarmaciaService {
    private readonly repo;
    private readonly ROL_MEDICO;
    private readonly ROL_FARMACIA;
    private readonly ROL_AUDITOR;
    constructor(repo: FarmaciaRepository);
    private verificarPermisoExclusivoFarmacia;
    obtenerInventario(rolEjecutor: number): Promise<Medicamento[]>;
    registrarMedicamento(dto: IngresarMedicamentoDTO, rolEjecutor: number): Promise<Medicamento>;
    obtenerRecetasPendientes(rolEjecutor: number, dniPaciente?: string): Promise<any[]>;
    despacharReceta(dto: DespacharRecetaDTO, rolEjecutor: number): Promise<void>;
}
//# sourceMappingURL=FarmaciaService.d.ts.map