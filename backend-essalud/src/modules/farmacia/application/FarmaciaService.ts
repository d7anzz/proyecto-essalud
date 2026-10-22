import { FarmaciaRepository } from '../domain/FarmaciaRepository';
import { Medicamento } from '../domain/Medicamento';
import { IngresarMedicamentoDTO } from './IngresarMedicamentoDTO';
import { DespacharRecetaDTO } from './DespacharRecetaDTO';

export class FarmaciaService {
  private readonly ROL_FARMACEUTICO = 3;

  constructor(private readonly repo: FarmaciaRepository) {}

  async obtenerInventario(rolEjecutor: number): Promise<Medicamento[]> {
    return await this.repo.listarInventario();
  }

  async registrarMedicamento(dto: IngresarMedicamentoDTO, rolEjecutor: number): Promise<Medicamento> {
    if (rolEjecutor !== this.ROL_FARMACEUTICO) {
      throw new Error('Acceso denegado: Solo el personal de Farmacia (Rol 3) está autorizado para gestionar el inventario.');
    }

    // Instanciamos el modelo de dominio para ejecutar sus validaciones automáticas de negocio
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

    if (!dto.idOrden || !dto.idMedicamento || dto.cantidadEntregada <= 0) {
      throw new Error('Validación: Los datos de la orden y la cantidad a entregar deben ser válidos.');
    }

    await this.repo.despacharRecetaTransaccional(dto.idOrden, dto.idMedicamento, dto.cantidadEntregada);
  }
}