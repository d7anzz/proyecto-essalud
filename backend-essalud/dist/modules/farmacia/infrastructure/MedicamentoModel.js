"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicamentoModel = void 0;
const typeorm_1 = require("typeorm");
let MedicamentoModel = class MedicamentoModel {
    idMedicamento;
    nombreMedicamento;
    composicion;
    stockActual;
    stockMinimo;
    fechaVencimiento;
};
exports.MedicamentoModel = MedicamentoModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id_medicamento' }),
    __metadata("design:type", Number)
], MedicamentoModel.prototype, "idMedicamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'nombre_medicamento' }),
    __metadata("design:type", String)
], MedicamentoModel.prototype, "nombreMedicamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, name: 'composicion' }),
    __metadata("design:type", String)
], MedicamentoModel.prototype, "composicion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'stock_actual' }),
    __metadata("design:type", Number)
], MedicamentoModel.prototype, "stockActual", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'stock_minimo' }),
    __metadata("design:type", Number)
], MedicamentoModel.prototype, "stockMinimo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'fecha_vencimiento' }),
    __metadata("design:type", String)
], MedicamentoModel.prototype, "fechaVencimiento", void 0);
exports.MedicamentoModel = MedicamentoModel = __decorate([
    (0, typeorm_1.Entity)('medicamentos')
], MedicamentoModel);
//# sourceMappingURL=MedicamentoModel.js.map