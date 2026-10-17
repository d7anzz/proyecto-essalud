import { DataSource } from 'typeorm';
import { ConsultaRepository } from '../domain/ConsultaRepository';
import { Consulta } from '../domain/Consulta';
export declare class MysqlConsultaRepository implements ConsultaRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    crearTransaccional(consulta: Consulta, medicamentos: Array<{
        idMedicamento: number;
        cantidadRecetada: number;
    }>): Promise<void>;
}
//# sourceMappingURL=MysqlConsultaRepository.d.ts.map