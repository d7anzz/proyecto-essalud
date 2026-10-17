import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/config/api.config';

export interface Cita {
  idCita?: number;
  dniPaciente: string;
  idMedico: string;
  idHorario: number;
  estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
  fechaCreacion?: string;
  nombrePaciente?: string;
  nombreMedico?: string;
  infoHorario?: {
    fecha: string;
    horaInicio: string;
    turno: string;
  };
  personal?: {
    nombre: string;
    apellidos: string;
    especialidad: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly url = API_ENDPOINTS.citas;

  constructor(private http: HttpClient) {}

  private obtenerHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('essalud_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    return { headers };
  }

  listar(): Observable<{ ok: boolean; data: Cita[] }> {
    return this.http.get<{ ok: boolean; data: Cita[] }>(this.url, this.obtenerHeaders());
  }

  crear(payload: { dniPaciente: string; dniMedico: string; idHorario: number }): Observable<{ ok: boolean; data: Cita }> {
    return this.http.post<{ ok: boolean; data: Cita }>(this.url, payload, this.obtenerHeaders());
  }

  actualizarEstado(idCita: number, estado: 'COMPLETADA' | 'CANCELADA'): Observable<{ ok: boolean; data: Cita }> {
    return this.http.put<{ ok: boolean; data: Cita }>(`${this.url}/${idCita}`, { estado }, this.obtenerHeaders());
  }

  eliminar(idCita: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.url}/${idCita}`, this.obtenerHeaders());
  }
}
