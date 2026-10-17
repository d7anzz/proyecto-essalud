import { MedicamentoModel } from './MedicamentoModel';
import { Medicamento } from '../domain/Medicamento';

export class MedicamentoMapper {
  static toDomain(m: MedicamentoModel): Medicamento {
    return new Medicamento(
      m.idMedicamento,
      m.nombreMedicamento,
      m.composicion,
      m.stockActual,
      m.stockMinimo,
      typeof m.fechaVencimiento === 'string' ? m.fechaVencimiento : (m.fechaVencimiento as any).toISOString().split('T')[0]
    );
  }

  static toPersistence(d: Medicamento): Partial<MedicamentoModel> {
    return {
      nombreMedicamento: d.nombreMedicamento,
      composicion: d.composicion,
      stockActual: d.stockActual,
      stockMinimo: d.stockMinimo,
      fechaVencimiento: d.fechaVencimiento
    };
  }
}