import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; 
import { API_ENDPOINTS } from '../../../config/api.config';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  private http = inject(HttpClient);

  dniUsuario = signal<string>('---------');
  idRol = signal<number>(2);
  institucion = signal<string>('Seguro Social de Salud (EsSalud)');
  estadoCredencial = signal<string>('Activa / Autorizada');

  passwordActual = signal<string>('');
  passwordNueva = signal<string>('');
  passwordConfirmar = signal<string>('');

  cargando = signal<boolean>(false);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  nombreRol = computed(() => {
    const rol = this.idRol();
    if (rol === 1) return 'Médico Especialista';
    if (rol === 2) return 'Personal Administrativo';
    if (rol === 3) return 'Personal de Farmacia';
    if (rol === 4) return 'Administrador del Sistema';
    return 'Personal Autorizado';
  });

  ngOnInit(): void {
    this.cargarDatosDesdeToken();
  }

  private cargarDatosDesdeToken(): void {
    try {
      const token = localStorage.getItem('essalud_token');
      if (!token) return;

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      if (payload.dni) this.dniUsuario.set(payload.dni);

      const rolDetectado = payload.id_rol || payload.idRol || localStorage.getItem('essalud_rol') || 1;
      this.idRol.set(Number(rolDetectado));

    } catch (error) {
      console.error('❌ Error al mapear la credencial en Perfil:', error);
    }
  }

  actualizarPassword(event: Event): void {
    event.preventDefault();
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    if (this.passwordNueva().length < 8) {
      this.mensajeError.set('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (this.passwordNueva() !== this.passwordConfirmar()) {
      this.mensajeError.set('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    this.cargando.set(true);

    
    const body = {
      dni: this.dniUsuario(),
      passwordActual: this.passwordActual(),
      passwordNueva: this.passwordNueva()
    };

    console.log('📡 Enviando solicitud real de cambio de clave para DNI:', body.dni);

    this.http.post(`${API_ENDPOINTS.auth}/cambiar-password`, body)
      .subscribe({
        next: (response: any) => {
          this.cargando.set(false);
          this.mensajeExito.set('Contraseña actualizada correctamente.');

          (event.target as HTMLFormElement).reset();
          this.passwordActual.set('');
          this.passwordNueva.set('');
          this.passwordConfirmar.set('');
        },
        error: (err) => {
          this.cargando.set(false);
          this.mensajeError.set(err.error?.error || 'Error al conectar con el servidor de EsSalud.');
        }
      });
  }
}
