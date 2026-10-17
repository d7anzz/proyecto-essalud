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
exports.CitaModel = void 0;
const typeorm_1 = require("typeorm");
const PacienteModel_1 = require("../../pacientes/infrastructure/PacienteModel");
const HorarioModel_1 = require("../../registro-horario/infrastructure/HorarioModel");
let CitaModel = class CitaModel {
    idCita;
    dniPaciente;
    idMedico;
    idHorario;
    estado;
    fechaCreacion;
    paciente;
    horario;
};
exports.CitaModel = CitaModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id_cita' }),
    __metadata("design:type", Number)
], CitaModel.prototype, "idCita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, name: 'dni_paciente' }),
    __metadata("design:type", String)
], CitaModel.prototype, "dniPaciente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, name: 'id_medico' }),
    __metadata("design:type", String)
], CitaModel.prototype, "idMedico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'id_horario' }),
    __metadata("design:type", Number)
], CitaModel.prototype, "idHorario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, name: 'estado' }),
    __metadata("design:type", String)
], CitaModel.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'fecha_creacion' }),
    __metadata("design:type", Date)
], CitaModel.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PacienteModel_1.PacienteModel, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'dni_paciente' }),
    __metadata("design:type", PacienteModel_1.PacienteModel)
], CitaModel.prototype, "paciente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HorarioModel_1.HorarioModel, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_horario' }),
    __metadata("design:type", HorarioModel_1.HorarioModel)
], CitaModel.prototype, "horario", void 0);
exports.CitaModel = CitaModel = __decorate([
    (0, typeorm_1.Entity)('citas_medicas')
], CitaModel);
//# sourceMappingURL=CitaModel.js.map