import { MedicamentoModel } from './MedicamentoModel';
import { Medicamento } from '../domain/Medicamento';
export declare class MedicamentoMapper {
    static toDomain(m: MedicamentoModel): Medicamento;
    static toPersistence(d: Medicamento): Partial<MedicamentoModel>;
}
//# sourceMappingURL=MedicamentoMapper.d.ts.map