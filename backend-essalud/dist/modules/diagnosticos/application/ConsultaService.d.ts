import { ConsultaRepository } from '../domain/ConsultaRepository';
import { CrearConsultaDTO } from './CrearConsultaDTO';
export declare class ConsultaService {
    private readonly repo;
    private readonly ROL_MEDICO;
    constructor(repo: ConsultaRepository);
    crearConsultaMedica(dto: CrearConsultaDTO, rolEjecutor: number): Promise<void>;
}
//# sourceMappingURL=ConsultaService.d.ts.map