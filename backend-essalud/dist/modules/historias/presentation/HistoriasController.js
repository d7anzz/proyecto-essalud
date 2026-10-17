"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoriasController = void 0;
class HistoriasController {
    historiasService;
    constructor(historiasService) {
        this.historiasService = historiasService;
    }
    async obtenerHistoriaPorDni(req, res) {
        try {
            const dniPacienteParam = req.params['dniPaciente'];
            if (typeof dniPacienteParam !== 'string') {
                res.status(400).json({
                    ok: false,
                    message: 'El DNI del paciente es obligatorio.'
                });
                return;
            }
            const dniPaciente = dniPacienteParam.trim();
            if (!/^[0-9]{8}$/.test(dniPaciente)) {
                res.status(400).json({
                    ok: false,
                    message: 'El DNI del paciente debe tener 8 dígitos.'
                });
                return;
            }
            const historia = await this.historiasService.obtenerHistoriaPorDni(dniPaciente);
            if (!historia) {
                res.status(404).json({
                    ok: false,
                    message: 'No se encontró un paciente con el DNI ingresado.'
                });
                return;
            }
            res.status(200).json({
                ok: true,
                data: historia
            });
        }
        catch (error) {
            console.error('[HistoriasController] Error al obtener historia clínica:', error.message);
            res.status(500).json({
                ok: false,
                message: 'Error al obtener la historia clínica del paciente.',
                error: error.message
            });
        }
    }
}
exports.HistoriasController = HistoriasController;
//# sourceMappingURL=HistoriasController.js.map