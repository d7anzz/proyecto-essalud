import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../shared/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = `${API_ENDPOINTS.auth}/login`;

  public isAuthenticated = signal<boolean>(!!localStorage.getItem('essalud_token'));

  login(dni: string, passwordIn: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { dni, passwordIn }).pipe(
      tap(response => {
        console.log('Respuesta cruda del Backend en el Login:', response);

        if (response?.requiereCambio || response?.data?.requiereCambio) {
          console.log('[AuthService] Flujo de primer ingreso detectado. No se almacena sesión aún.');
          localStorage.setItem('essalud_dni_cambio', response?.dni || response?.data?.dni);
          return;
        }

        const tokenExtraido = response?.token || response?.data?.token;
        const rolExtraido = response?.idRol || response?.data?.idRol;
        const dniExtraido = response?.dni || response?.data?.dni;

        if (tokenExtraido) {
          localStorage.setItem('essalud_token', tokenExtraido);

          if (rolExtraido) {
            localStorage.setItem('essalud_rol', rolExtraido.toString());
          }

          if (dniExtraido) {
            localStorage.setItem('essalud_dni', dniExtraido);
          }

          this.isAuthenticated.set(true);

          console.log(
            '[AuthService] Token guardado físicamente en LocalStorage:',
            localStorage.getItem('essalud_token')
          );
        } else {
          console.error(
            '[AuthService] El backend respondió un 200, pero NO se encontró ninguna propiedad token en el JSON.'
          );
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('essalud_token');
    localStorage.removeItem('essalud_rol');
    localStorage.removeItem('essalud_dni_cambio');
    localStorage.removeItem('essalud_dni');

    this.isAuthenticated.set(false);
  }
}