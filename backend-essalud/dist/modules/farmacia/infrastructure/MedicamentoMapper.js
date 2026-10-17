"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicamentoMapper = void 0;
const Medicamento_1 = require("../domain/Medicamento");
class MedicamentoMapper {
    static toDomain(m) {
        return new Medicamento_1.Medicamento(m.idMedicamento, m.nombreMedicamento, m.composicion, m.stockActual, m.stockMinimo, typeof m.fechaVencimiento === 'string' ? m.fechaVencimiento : m.fechaVencimiento.toISOString().split('T')[0]);
    }
    static toPersistence(d) {
        return {
            nombreMedicamento: d.nombreMedicamento,
            composicion: d.composicion,
            stockActual: d.stockActual,
            stockMinimo: d.stockMinimo,
            fechaVencimiento: d.fechaVencimiento
        };
    }
}
exports.MedicamentoMapper = MedicamentoMapper;
//# sourceMappingURL=MedicamentoMapper.js.map