import { HistoriaClinica, HistoriasRepository } from '../domain/HistoriasRepository';
export declare class HistoriasService {
    private readonly historiasRepository;
    constructor(historiasRepository: HistoriasRepository);
    obtenerHistoriaPorDni(dniPaciente: string): Promise<HistoriaClinica | null>;
}
//# sourceMappingURL=HistoriasService.d.ts.map