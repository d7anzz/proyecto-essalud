import { HorarioModel } from './HorarioModel';
import { Horario } from '../domain/Horario';
export declare class HorarioMapper {
    static toDomain(m: HorarioModel): Horario;
    static toPersistence(d: Horario): Partial<HorarioModel>;
}
//# sourceMappingURL=HorarioMapper.d.ts.map