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
exports.ConsultaModel = void 0;
const typeorm_1 = require("typeorm");
let ConsultaModel = class ConsultaModel {
    idConsulta;
    idCita;
    dniPaciente;
    idMedico;
    diagnostico;
    observaciones;
    fechaAtencion;
};
exports.ConsultaModel = ConsultaModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id_consulta' }),
    __metadata("design:type", Number)
], ConsultaModel.prototype, "idConsulta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'id_cita' }),
    __metadata("design:type", Number)
], ConsultaModel.prototype, "idCita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, name: 'dni_paciente' }),
    __metadata("design:type", String)
], ConsultaModel.prototype, "dniPaciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, name: 'id_medico' }),
    __metadata("design:type", String)
], ConsultaModel.prototype, "idMedico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'diagnostico' }),
    __metadata("design:type", String)
], ConsultaModel.prototype, "diagnostico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'observaciones' }),
    __metadata("design:type", String)
], ConsultaModel.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'fecha_atencion', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ConsultaModel.prototype, "fechaAtencion", void 0);
exports.ConsultaModel = ConsultaModel = __decorate([
    (0, typeorm_1.Entity)('consultas_medicas')
], ConsultaModel);
//# sourceMappingURL=ConsultaModel.js.map