import { HistoriaClinica, HistoriasRepository } from '../domain/HistoriasRepository';

export class HistoriasService {
  constructor(private readonly historiasRepository: HistoriasRepository) {}

  async obtenerHistoriaPorDni(dniPaciente: string): Promise<HistoriaClinica | null> {
    return await this.historiasRepository.obtenerHistoriaPorDni(dniPaciente);
  }
}