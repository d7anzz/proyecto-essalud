import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/config/api.config';

export interface PacienteResponse {
  dni: string;
  nombre: string;
  apellidos: string;
  fec_nac: string;
  sexo: string;
  telefono?: string;
  tipo_seguro?: string;
  grupo_sanguineo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private http = inject(HttpClient);
  private apiUrl = API_ENDPOINTS.pacientes;

  obtenerPacientes(): Observable<PacienteResponse[]> {
    return this.http.get<PacienteResponse[]>(this.apiUrl);
  }

  buscarPorDni(dni: string): Observable<{ ok: boolean; data: PacienteResponse[] }> {
    return this.http.get<{ ok: boolean; data: PacienteResponse[] }>(`${this.apiUrl}/buscar/${dni}`);
  }

  crearPaciente(paciente: PacienteResponse): Observable<any> {
    return this.http.post<any>(this.apiUrl, paciente);
  }

  actualizarPaciente(dni: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${dni}`, payload);
  }

  eliminarPaciente(dni: string, passwordOperador: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${dni}`, {
      body: { passwordOperador }
    });
  }
}
