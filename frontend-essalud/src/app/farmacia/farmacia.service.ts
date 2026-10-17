import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class FarmaciaService {
  private apiUrl = API_ENDPOINTS.farmacia;

  constructor(private http: HttpClient) {}

  listarRecetasPendientes(dniPaciente?: string): Observable<any> {
    let params = new HttpParams();
    if (dniPaciente && dniPaciente.trim() !== '') {
      params = params.set('dniPaciente', dniPaciente.trim());
    }
    // Golpea el GET /api/farmacia/recetas protegido por el JWT
    return this.http.get<any>(`${this.apiUrl}/recetas`, { params });
  }

  entregarReceta(payload: { idOrden: number; idMedicamento: number; cantidadEntregada: number }): Observable<any> {
    // Golpea el PUT /api/farmacia/despachar
    return this.http.put<any>(`${this.apiUrl}/despachar`, payload);
  }

  obtenerInventario(): Observable<any> {
    // Golpea el GET /api/farmacia/inventario
    return this.http.get<any>(`${this.apiUrl}/inventario`);
  }

  agregarMedicamento(payload: {
    nombreMedicamento: string;
    composicion: string;
    cantidadIngreso: number;
    stockMinimo: number;
    fechaVencimiento: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/inventario`, payload);
  }
}
