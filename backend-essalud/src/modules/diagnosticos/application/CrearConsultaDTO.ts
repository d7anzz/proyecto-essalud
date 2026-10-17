export interface MedicamentoRecetadoDTO {
  idMedicamento: number;
  cantidadRecetada: number;
}

export interface CrearConsultaDTO {
  idCita: number;
  dniPaciente: string;
  idMedico: string;
  diagnostico: string;
  observaciones: string;
  medicamentos?: MedicamentoRecetadoDTO[];
}