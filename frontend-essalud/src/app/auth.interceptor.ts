import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('essalud_token');
  const rol = localStorage.getItem('essalud_rol');
  const dni = localStorage.getItem('essalud_dni');

  let headers: { [key: string]: string } = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (rol) {
    headers['x-rol-id'] = rol;
  }

  if (dni) {
    headers['x-user-dni'] = dni;
  }

  if (Object.keys(headers).length > 0) {
    const clonedRequest = req.clone({
      setHeaders: headers
    });

    return next(clonedRequest);
  }

  return next(req);
};