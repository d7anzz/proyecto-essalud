"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalController = void 0;
class PersonalController {
    registrarPersonalService;
    constructor(registrarPersonalService) {
        this.registrarPersonalService = registrarPersonalService;
    }
    registrar = async (req, res) => {
        try {
            const body = req.body || {};
            const rolEjecutor = req.user?.idRol ?? req.user?.id_rol;
            if (!rolEjecutor) {
                res.status(401).json({
                    message: 'No autorizado: No se pudo identificar el rol del operador.'
                });
                return;
            }
            if (!body.id_rol && !body.idRol) {
                res.status(400).json({
                    message: 'El rol del trabajador es obligatorio.'
                });
                return;
            }
            const dto = {
                dni: body.dni,
                nombre: body.nombre,
                apellidos: body.apellidos,
                username: body.username,
                idRol: Number(body.id_rol ?? body.idRol),
                colegiatura: body.colegiatura || null,
                idEspecialidad: body.id_especialidad ? Number(body.id_especialidad) : null
            };
            await this.registrarPersonalService.ejecutar(dto, Number(rolEjecutor));
            res.status(201).json({
                message: `El personal con DNI ${dto.dni} ha sido registrado exitosamente y su cuenta de acceso fue creada.`
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Ocurrió un error inesperado al registrar al personal.'
            });
        }
    };
}
exports.PersonalController = PersonalController;
//# sourceMappingURL=PersonalController.js.map