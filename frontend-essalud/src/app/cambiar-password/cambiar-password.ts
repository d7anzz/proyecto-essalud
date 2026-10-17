import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../shared/config/api.config';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-password.html',
  styleUrls: ['./cambiar-password.css']
})
export class CambiarPassword implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = `${API_ENDPOINTS.auth}/actualizar-password-inicial`;
  dniUsuario = signal<string>('');

  passwordForm = this.fb.group({
    nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmarPassword: ['', Validators.required]
  }, { validators: this.validarPasswordsCoincidentes });

  ngOnInit(): void {
    const dni = localStorage.getItem('essalud_dni_cambio');
    if (!dni) {
      this.router.navigate(['/login']);
      return;
    }
    this.dniUsuario.set(dni);
  }

  validarPasswordsCoincidentes(control: AbstractControl): ValidationErrors | null {
    const nueva = control.get('nuevaPassword')?.value;
    const confirmar = control.get('confirmarPassword')?.value;
    return nueva === confirmar ? null : { noCoinciden: true };
  }

  onCambiarPassword(): void {
    if (this.passwordForm.valid) {
      const payload = {
        dni: this.dniUsuario(),
        nuevaPassword: this.passwordForm.value.nuevaPassword
      };

      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          alert('🔒 Contraseña inicial modificada con éxito. Por favor, inicie sesión con su nueva clave.');
          localStorage.removeItem('essalud_dni_cambio');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar: ' + (err.error?.message || 'No se pudo procesar el cambio en el servidor.'));
        }
      });
    }
  }
}
