"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoriasService = void 0;
class HistoriasService {
    historiasRepository;
    constructor(historiasRepository) {
        this.historiasRepository = historiasRepository;
    }
    async obtenerHistoriaPorDni(dniPaciente) {
        return await this.historiasRepository.obtenerHistoriaPorDni(dniPaciente);
    }
}
exports.HistoriasService = HistoriasService;
//# sourceMappingURL=HistoriasService.js.map