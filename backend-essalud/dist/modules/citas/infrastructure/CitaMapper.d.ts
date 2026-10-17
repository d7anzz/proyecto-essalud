import { CitaModel } from './CitaModel';
import { Cita } from '../domain/Cita';
export declare class CitaMapper {
    static toDomain(m: CitaModel): Cita;
    static toPersistence(c: Cita): Partial<CitaModel>;
}
//# sourceMappingURL=CitaMapper.d.ts.map