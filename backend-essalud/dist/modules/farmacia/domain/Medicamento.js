"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medicamento = void 0;
class Medicamento {
    idMedicamento;
    nombreMedicamento;
    composicion;
    stockActual;
    stockMinimo;
    fechaVencimiento;
    constructor(idMedicamento, nombreMedicamento, composicion, stockActual, stockMinimo, fechaVencimiento) {
        this.idMedicamento = idMedicamento;
        this.nombreMedicamento = nombreMedicamento;
        this.composicion = composicion;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
        this.fechaVencimiento = fechaVencimiento;
    }
}
exports.Medicamento = Medicamento;
//# sourceMappingURL=Medicamento.js.map