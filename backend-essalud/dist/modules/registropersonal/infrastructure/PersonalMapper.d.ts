import { Personal } from '../domain/Personal';
import { PersonalModel } from './PersonalModel';
export declare class PersonalMapper {
    static toDomain(model: PersonalModel, idRol: number): Personal;
    static toPersistence(entity: Personal): PersonalModel;
}
//# sourceMappingURL=PersonalMapper.d.ts.map