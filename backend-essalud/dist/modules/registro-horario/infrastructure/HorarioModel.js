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
exports.HorarioModel = void 0;
const typeorm_1 = require("typeorm");
const PersonalModel_1 = require("../../registropersonal/infrastructure/PersonalModel");
let HorarioModel = class HorarioModel {
    id;
    dni;
    personal;
    fecha;
    horaInicio;
    horaFin;
    turno;
    estado;
};
exports.HorarioModel = HorarioModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], HorarioModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8 }),
    __metadata("design:type", String)
], HorarioModel.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PersonalModel_1.PersonalModel, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'dni', referencedColumnName: 'dni' }),
    __metadata("design:type", PersonalModel_1.PersonalModel)
], HorarioModel.prototype, "personal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], HorarioModel.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], HorarioModel.prototype, "horaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], HorarioModel.prototype, "horaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['MAÑANA', 'TARDE', 'NOCHE'] }),
    __metadata("design:type", String)
], HorarioModel.prototype, "turno", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint' }),
    __metadata("design:type", Boolean)
], HorarioModel.prototype, "estado", void 0);
exports.HorarioModel = HorarioModel = __decorate([
    (0, typeorm_1.Entity)('horarios_disponibles')
], HorarioModel);
//# sourceMappingURL=HorarioModel.js.map