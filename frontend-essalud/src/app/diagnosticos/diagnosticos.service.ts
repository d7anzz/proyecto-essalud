import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticosService {
  private readonly consultasUrl = API_ENDPOINTS.consultas;
  private readonly citasUrl = API_ENDPOINTS.citas;
  private readonly farmaciaUrl = API_ENDPOINTS.farmacia;

  constructor(private http: HttpClient) {}

  private obtenerHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('essalud_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });

    return { headers };
  }

  obtenerCitasMedicas(idMedico: string): Observable<any> {
    return this.http.get<any>(
      `${this.citasUrl}/medico/${idMedico}`,
      this.obtenerHeaders()
    );
  }

  obtenerCatalogoMedicamentos(): Observable<any> {
    return this.http.get<any>(
      `${this.farmaciaUrl}/inventario`,
      this.obtenerHeaders()
    );
  }

  registrarActoMedico(payload: {
    idCita: number;
    dniPaciente: string;
    idMedico: string;
    diagnostico: string;
    observaciones: string;
    medicamentos: Array<{ idMedicamento: number; cantidadRecetada: number }>;
  }): Observable<any> {
    return this.http.post<any>(
      this.consultasUrl,
      payload,
      this.obtenerHeaders()
    );
  }
}