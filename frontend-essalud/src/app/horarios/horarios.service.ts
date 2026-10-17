import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/config/api.config';

export interface Horario {
  id?: number;
  dni: string;
  fecha: string;
  horaInicio: string;
  horaFin?: string;
  turno: 'MAÑANA' | 'TARDE' | 'NOCHE';
  cantidadPacientes?: number;
  estado?: 'DISPONIBLE' | 'OCUPADO' | boolean;
  personal?: {
    nombre: string;
    apellidos: string;
    colegiatura: string | null;
    id_especialidad?: number | null;
    idEspecialidad?: number | null;
    especialidad?: string;
  };
  subBloquesReales?: Horario[];
}

export interface DiaSemana {
  nombre: string;
  fechaFormateada: string;
  fechaVisual: string;
  horarios: Horario[];
}

@Injectable({ providedIn: 'root' })
export class RegistroHorarioService {
  private apiUrl = API_ENDPOINTS.horarios;

  constructor(private http: HttpClient) {}

  private obtenerHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('essalud_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
    return { headers };
  }

  listar(): Observable<{ ok: boolean; data: Horario[] }> {
    return this.http.get<{ ok: boolean; data: Horario[] }>(this.apiUrl, this.obtenerHeaders());
  }

  crear(horario: Horario): Observable<{ ok: boolean; data: Horario }> {
    return this.http.post<{ ok: boolean; data: Horario }>(this.apiUrl, horario, this.obtenerHeaders());
  }

  actualizar(id: number, horario: Partial<Horario>): Observable<{ ok: boolean; data: Horario }> {
    return this.http.put<{ ok: boolean; data: Horario }>(`${this.apiUrl}/${id}`, horario, this.obtenerHeaders());
  }

  eliminar(id: number): Observable<{ ok: boolean; eliminado: boolean }> {
    return this.http.delete<{ ok: boolean; eliminado: boolean }>(`${this.apiUrl}/${id}`, this.obtenerHeaders());
  }
}
