import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('essalud_token');
  const rolUsuarioStr = localStorage.getItem('essalud_rol');

  // 1. Si no hay token, bloqueo inmediato (No está logueado)
  if (!token || token.trim() === '') {
    console.warn('🔒 [Guard] Acceso bloqueado: No existe sesión activa.');
    router.navigate(['/login']);
    return false;
  }

  // 2. Control de Roles: Leemos qué roles tienen permiso de ver esta ruta específica
  const rolesPermitidos = route.data?.['roles'] as Array<number>;

  // Si la ruta requiere roles específicos, validamos el rol del usuario
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const rolUsuario = rolUsuarioStr ? Number(rolUsuarioStr) : null;

    // Si el rol del usuario no está en la lista de permitidos, lo rebotamos
    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      console.error(`🚫 [Guard] Acceso denegado: El rol ${rolUsuario} no tiene permisos para la ruta ${state.url}`);
      alert('🚫 No tiene permisos para acceder a este módulo.');
      router.navigate(['/inicio']); // Lo mandamos a su panel de inicio seguro
      return false;
    }
  }

  return true; // Cumple con todo, pasa libremente
};
