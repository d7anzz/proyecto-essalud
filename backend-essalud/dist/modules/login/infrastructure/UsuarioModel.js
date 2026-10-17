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
exports.UsuarioModel = void 0;
const typeorm_1 = require("typeorm");
let UsuarioModel = class UsuarioModel {
    dni;
    username;
    passwordHash;
    idRol;
    estado;
    intentosFallidos;
    requiereCambioPassword;
};
exports.UsuarioModel = UsuarioModel;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 8 }),
    __metadata("design:type", String)
], UsuarioModel.prototype, "dni", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], UsuarioModel.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], UsuarioModel.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_rol', type: 'int' }),
    __metadata("design:type", Number)
], UsuarioModel.prototype, "idRol", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], UsuarioModel.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'intentos_fallidos', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UsuarioModel.prototype, "intentosFallidos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requiere_cambio_password', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], UsuarioModel.prototype, "requiereCambioPassword", void 0);
exports.UsuarioModel = UsuarioModel = __decorate([
    (0, typeorm_1.Entity)({ name: 'usuarios' })
], UsuarioModel);
//# sourceMappingURL=UsuarioModel.js.map