import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_ENDPOINTS } from '../shared/config/api.config';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  private apiUrl = API_ENDPOINTS.personal;

  registroForm = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
    apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
    fec_nac: ['', []],
    telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
    username: ['', [Validators.required]],
    id_rol: ['2', [Validators.required]],
    colegiatura: [{ value: '', disabled: true }],
    id_especialidad: [{ value: '', disabled: true }]
  });

  ngOnInit(): void {
    const token = localStorage.getItem('essalud_token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.registroForm.get('id_rol')?.valueChanges.subscribe(rol => {
      const cmp = this.registroForm.get('colegiatura');
      const esp = this.registroForm.get('id_especialidad');

      if (rol === '1') {
        cmp?.enable();
        cmp?.setValidators([Validators.required, Validators.pattern('^[0-9]{5,6}$')]);
        esp?.enable();
        esp?.setValidators([Validators.required]);
      } else {
        cmp?.disable();
        cmp?.setValue('');
        cmp?.clearValidators();
        esp?.disable();
        esp?.setValue('');
        esp?.clearValidators();
      }
      cmp?.updateValueAndValidity();
      esp?.updateValueAndValidity();
    });
  }

  onRegistrar(): void {
    if (this.registroForm.valid) {
      const payload = this.registroForm.getRawValue();
      const token = localStorage.getItem('essalud_token');

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.post(this.apiUrl, payload, { headers }).subscribe({
        next: () => {
          alert('✅ Personal registrado exitosamente en el sistema.');
          this.registroForm.reset({ id_rol: '2' });
        },
        error: (err) => {
          console.error('Error detallado recibido en Angular:', err);
          alert('Error al registrar: ' + (err.error?.message || err.error?.error || 'Error de conexión o de autorización.'));
        }
      });
    } else {
      this.registroForm.markAllAsTouched();
    }
  }

  regresar(): void {
    this.router.navigate(['/dashboard/inicio']);
  }
}
