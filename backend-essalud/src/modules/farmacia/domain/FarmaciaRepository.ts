import { Medicamento } from './Medicamento';

export interface FarmaciaRepository {
  listarInventario(): Promise<Medicamento[]>;
  ingresarMedicamento(medicamento: Medicamento): Promise<Medicamento>;
  listarRecetasPendientes(dniPaciente?: string): Promise<any[]>;
  despacharRecetaTransaccional(idOrden: number, idMedicamento: number, cantidadEntregada: number): Promise<void>;
}