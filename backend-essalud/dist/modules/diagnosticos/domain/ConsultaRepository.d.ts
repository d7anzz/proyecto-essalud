import { Consulta } from './Consulta';
export interface ConsultaRepository {
    crearTransaccional(consulta: Consulta, medicamentos: Array<{
        idMedicamento: number;
        cantidadRecetada: number;
    }>): Promise<void>;
}
//# sourceMappingURL=ConsultaRepository.d.ts.map