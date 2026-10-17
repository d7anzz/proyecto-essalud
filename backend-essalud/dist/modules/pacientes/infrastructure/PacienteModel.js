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
exports.PacienteModel = void 0;
const typeorm_1 = require("typeorm");
let PacienteModel = class PacienteModel {
    dni;
    nombre;
    apellidos;
    fechaNacimiento;
};
exports.PacienteModel = PacienteModel;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 8 }),
    __metadata("design:type", String)
], PacienteModel.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], PacienteModel.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], PacienteModel.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fec_nac', type: 'date' }),
    __metadata("design:type", Date)
], PacienteModel.prototype, "fechaNacimiento", void 0);
exports.PacienteModel = PacienteModel = __decorate([
    (0, typeorm_1.Entity)('pacientes')
], PacienteModel);
//# sourceMappingURL=PacienteModel.js.map