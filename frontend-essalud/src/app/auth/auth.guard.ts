import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('essalud_token');
  const rolUsuarioStr = localStorage.getItem('essalud_rol');

  // 1. Si no hay token, redirección obligatoria al login (No hay sesión)
  if (!token || token.trim() === '') {
    console.warn('🔒 [Guard] Acceso bloqueado: No existe sesión activa.');
    router.navigate(['/login']);
    return false;
  }

  // 2. Control de Roles: Leemos qué roles tienen permiso en esta ruta
  const rolesPermitidos = route.data?.['roles'] as Array<number>;

  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const rolUsuario = rolUsuarioStr ? Number(rolUsuarioStr) : null;

    // Si el rol no está autorizado
    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      console.error(`🚫 [Guard] Acceso denegado: El rol ${rolUsuario} no tiene permisos para la ruta ${state.url}`);
      alert('🚫 No tiene permisos para acceder a este módulo.');

      // Si tiene sesión activa, lo mandamos al inicio del dashboard; si no, al login
      const rutaDestino = token ? '/dashboard/inicio' : '/login';
      router.navigate([rutaDestino]);

      return false;
    }
  }

  return true; // ¡Todo en orden, pase libre!
};
