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
exports.PersonalModel = exports.EspecialidadInline = void 0;
const typeorm_1 = require("typeorm");
const UsuarioModel_1 = require("../../login/infrastructure/UsuarioModel");
let EspecialidadInline = class EspecialidadInline {
    id;
    nombre;
};
exports.EspecialidadInline = EspecialidadInline;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'id_especialidad' }),
    __metadata("design:type", Number)
], EspecialidadInline.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_especialidad' }),
    __metadata("design:type", String)
], EspecialidadInline.prototype, "nombre", void 0);
exports.EspecialidadInline = EspecialidadInline = __decorate([
    (0, typeorm_1.Entity)('especialidades')
], EspecialidadInline);
let PersonalModel = class PersonalModel {
    dni;
    nombre;
    apellidos;
    colegiatura;
    idEspecialidad;
    usuario;
    especialidad;
};
exports.PersonalModel = PersonalModel;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 8 }),
    __metadata("design:type", String)
], PersonalModel.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'nombre' }),
    __metadata("design:type", String)
], PersonalModel.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'apellidos' }),
    __metadata("design:type", String)
], PersonalModel.prototype, "apellidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, name: 'colegiatura', nullable: true, unique: true }),
    __metadata("design:type", Object)
], PersonalModel.prototype, "colegiatura", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'id_especialidad', nullable: true }),
    __metadata("design:type", Object)
], PersonalModel.prototype, "idEspecialidad", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UsuarioModel_1.UsuarioModel, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'dni' }),
    __metadata("design:type", UsuarioModel_1.UsuarioModel)
], PersonalModel.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => EspecialidadInline, { onDelete: 'SET NULL', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_especialidad' }),
    __metadata("design:type", EspecialidadInline)
], PersonalModel.prototype, "especialidad", void 0);
exports.PersonalModel = PersonalModel = __decorate([
    (0, typeorm_1.Entity)('personal_salud')
], PersonalModel);
//# sourceMappingURL=PersonalModel.js.map