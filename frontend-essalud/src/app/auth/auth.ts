import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class Auth {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    passwordIn: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { dni, passwordIn } = this.loginForm.value;

      this.authService.login(dni!, passwordIn!).subscribe({
        next: (response: any) => {
          console.log('✅ [Login] Respuesta recibida del servidor.');

          if (response.data?.requiereCambio) {
            console.log('🔒 Primer ingreso detectado. Forzando cambio de contraseña...');
            localStorage.setItem('essalud_dni_cambio', response.data.dni);

            setTimeout(() => {
              this.router.navigate(['/cambiar-password']);
            }, 300);
            return;
          }

          const roleId = response.data?.idRol;
          if (roleId) {
            localStorage.setItem('essalud_rol', roleId.toString());
          }

          setTimeout(() => {
            console.log('🚀 Redirigiendo al Portal General bajo el nuevo Layout Premium...');
            // 🟦 FIX DEFINITIVO: Ahora redirige al scope del DashboardLayoutComponent
            this.router.navigate(['/dashboard/inicio']);
          }, 300);
        },
        error: (err) => {
          console.error('❌ [Login] Error en las credenciales:', err);
          alert('❌ DNI o contraseña incorrectos o cuenta bloqueada.');
        }
      });
    }
  }
}
