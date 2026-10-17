import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayoutComponent implements OnInit {
  private router = inject(Router);

  // 🎛️ Signals para controlar la interactividad de la interfaz (UI)
  sidebarColapsado = signal<boolean>(false);
  mostrarMenuUsuario = signal<boolean>(false);

  // 👤 Signals reactivos para almacenar los datos REALES extraídos del operador
  nombreUsuario = signal<string>('Usuario EsSalud');
  idRol = signal<number>(2); // Inicializa por defecto en rol administrativo hasta descifrar el JWT
  fotoMedico = signal<string | null>(null);

  // 📊 Mapeo dinámico e institucional de Roles (¡Conectado directamente a tus directivas de vista!)
  nombreRol = computed(() => {
    const rol = this.idRol();
    if (rol === 1) return 'Médico';
    if (rol === 2) return 'Administrativo';
    if (rol === 3) return 'Farmacia';
    if (rol === 4) return 'Jefe de Hospital';
    return 'Personal Autorizado';
  });

  ngOnInit(): void {
    this.cargarUsuarioDesdeToken();
  }

  /**
   * 🔍 Extrae, decodifica criptográficamente el payload del JWT real
   * almacenado en el LocalStorage e inyecta los datos en la vista.
   */
  private cargarUsuarioDesdeToken(): void {
    try {
      const token = localStorage.getItem('essalud_token');

      if (!token) {
        this.logout();
        return;
      }

      // 🔍 Decodificación nativa del formato criptográfico JWT (Segmento Central)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      console.log('📊 Payload real recibido en el Layout:', payload);

      // 🎯 SOLUCIÓN AL NOMBRE: Dado que tu JWT envía 'dni', lo inyectamos de forma segura como credencial visible
      if (payload.dni) {
        this.nombreUsuario.set(`${payload.dni}`);
      } else {
        this.nombreUsuario.set(payload.nombre || payload.username || 'Usuario EsSalud');
      }

      // 🚨 CONTROL DE DAÑOS DEL ROL:
      // Mapeamos de forma nativa la propiedad 'id_rol' validada en tu consola de depuración
      const rolDetectado = payload.id_rol || payload.idRol || localStorage.getItem('essalud_rol') || 1;
      this.idRol.set(Number(rolDetectado));

      if (payload.foto) {
        this.fotoMedico.set(payload.foto);
      }

    } catch (error) {
      console.error('❌ Error crítico al procesar la sesión criptográfica:', error);
      this.logout();
    }
  }

  toggleMenuUsuario(): void {
    this.mostrarMenuUsuario.set(!this.mostrarMenuUsuario());
  }

  logout(): void {
    localStorage.removeItem('essalud_token');
    localStorage.removeItem('essalud_rol'); // Limpieza absoluta de persistencia
    this.router.navigate(['/login']);
  }
}
