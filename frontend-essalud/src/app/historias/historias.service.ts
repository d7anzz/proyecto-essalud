import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/config/api.config';

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

export interface HistoriaResponse {
  ok: boolean;
  data: HistoriaClinica;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoriasService {
  private http = inject(HttpClient);
  private apiUrl = API_ENDPOINTS.historias;

  obtenerHistoriaPorDni(dniPaciente: string): Observable<HistoriaResponse> {
    return this.http.get<HistoriaResponse>(`${this.apiUrl}/${dniPaciente}`);
  }
}