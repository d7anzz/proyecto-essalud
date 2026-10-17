export interface IngresarMedicamentoDTO {
  nombreMedicamento: string;
  composicion: string;
  cantidadIngreso: number;
  stockMinimo: number;
  fechaVencimiento: string;
}