import { FarmaciaRepository } from '../domain/FarmaciaRepository';
import { Medicamento } from '../domain/Medicamento';
import { IngresarMedicamentoDTO } from './IngresarMedicamentoDTO';
import { DespacharRecetaDTO } from './DespacharRecetaDTO';

export class FarmaciaService {
  private readonly ROL_FARMACEUTICO = 3;

  constructor(private readonly repo: FarmaciaRepository) {}

  async obtenerInventario(rolEjecutor: number): Promise<Medicamento[]> {
    if (rolEjecutor !== this.ROL_FARMACEUTICO) {
      throw new Error('Acceso denegado: No tiene permisos de lectura sobre el inventario.');
    }
    return this.repo.listarInventario();
  }

  async registrarMedicamento(dto: IngresarMedicamentoDTO, rolEjecutor: number): Promise<Medicamento> {
    if (rolEjecutor !== this.ROL_FARMACEUTICO) {
      throw new Error('Acceso denegado: Solo el personal de Farmacia (Rol 3) está autorizado para gestionar el inventario.');
    }

    const nuevoMedicamento = new Medicamento(
      0,
      dto.nombreMedicamento,
      dto.composicion,
      dto.cantidadIngreso,
      dto.stockMinimo,
      dto.fechaVencimiento
    );

    return await this.repo.ingresarMedicamento(nuevoMedicamento);
  }

  async obtenerRecetasPendientes(rolEjecutor: number, dniPaciente?: string): Promise<any[]> {
    return await this.repo.listarRecetasPendientes(dniPaciente);
  }

  async despacharReceta(dto: DespacharRecetaDTO, rolEjecutor: number): Promise<void> {
    if (rolEjecutor !== this.ROL_FARMACEUTICO) {
      throw new Error('Acceso denegado: Solo el personal de Farmacia (Rol 3) está autorizado para entregar medicamentos.');
    }

    if (!dto.idOrden || !dto.idMedicamento) {
      throw new Error('Validación: Los datos de la orden y el medicamento son obligatorios.');
    }

    if (dto.cantidadEntregada <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    await this.repo.despacharRecetaTransaccional(dto.idOrden, dto.idMedicamento, dto.cantidadEntregada);
  }
}