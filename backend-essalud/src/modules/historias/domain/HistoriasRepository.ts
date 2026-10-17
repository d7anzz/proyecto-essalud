export interface PacienteHistoria {
  dni: string;
  nombre: string;
  apellidos: string;
  fecNac: string;
}

export interface MedicamentoHistoria {
  idMedicamento: number;
  nombreMedicamento: string;
  composicion: string;
  cantidadRecetada: number;
  cantidadEntregada: number;
  estadoEntrega: string;
}

export interface ConsultaHistoria {
  idConsulta: number;
  idCita: number;
  fechaAtencion: string;
  estadoCita: string;
  medico: {
    dni: string;
    nombre: string;
    apellidos: string;
    especialidad: string | null;
  };
  diagnostico: string;
  observaciones: string | null;
  medicamentos: MedicamentoHistoria[];
}

export interface HistoriaClinica {
  paciente: PacienteHistoria;
  consultas: ConsultaHistoria[];
}

export interface HistoriasRepository {
  obtenerHistoriaPorDni(dniPaciente: string): Promise<HistoriaClinica | null>;
}