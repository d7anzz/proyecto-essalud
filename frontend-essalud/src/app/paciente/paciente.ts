import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService, PacienteResponse } from './paciente.service';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente.html',
  styleUrls: ['./paciente.css']
})
export class PacienteComponent implements OnInit {
  private pacienteService = inject(PacienteService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  pacientes = signal<PacienteResponse[]>([]);
  filtroNombre = signal<string>('');
  filtroDni = signal<string>('');

  mostrarModal = signal<boolean>(false);
  esModoEdicion = signal<boolean>(false);

  pacienteForm = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    fec_nac: ['', Validators.required],
    sexo: ['', [Validators.required, Validators.pattern('^[MF]$')]],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    tipo_seguro: ['TITULAR', Validators.required],
    grupo_sanguineo: ['', Validators.required]
  });

  pacientesFiltrados = computed(() => {
    const list = this.pacientes();
    const name = this.filtroNombre().toLowerCase().trim();
    const dni = this.filtroDni().trim();

    return list.filter(p => {
      const matchName =
        !name ||
        p.nombre.toLowerCase().includes(name) ||
        p.apellidos.toLowerCase().includes(name);

      const matchDni = !dni || p.dni.includes(dni);

      return matchName && matchDni;
    });
  });

  ngOnInit(): void {
    const tokenExistente = localStorage.getItem('essalud_token');

    if (!tokenExistente) {
      console.warn('[PacienteComponent] No hay token en memoria. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacienteService.obtenerPacientes().subscribe({
      next: (data) => this.pacientes.set(data),
      error: (err) => console.error('Error inyectando data:', err)
    });
  }

  abrirModalCrear(): void {
    this.esModoEdicion.set(false);
    this.pacienteForm.reset({
      tipo_seguro: 'TITULAR',
      sexo: '',
      grupo_sanguineo: ''
    });
    this.pacienteForm.get('dni')?.enable();
    this.mostrarModal.set(true);
  }

  abrirModalEditar(paciente: PacienteResponse): void {
    this.esModoEdicion.set(true);

    this.pacienteForm.setValue({
      dni: paciente.dni,
      nombre: paciente.nombre,
      apellidos: paciente.apellidos,
      fec_nac: paciente.fec_nac ? paciente.fec_nac.substring(0, 10) : '',
      sexo: paciente.sexo || 'M',
      telefono: paciente.telefono || '',
      tipo_seguro: paciente.tipo_seguro || 'TITULAR',
      grupo_sanguineo: paciente.grupo_sanguineo || ''
    });

    this.pacienteForm.get('dni')?.disable();
    this.mostrarModal.set(true);
  }

  verHistoriaClinica(dni: string): void {
    this.router.navigate(['/dashboard/historias'], {
      queryParams: { dni }
    });
  }

  onGuardarPaciente(): void {
    if (this.pacienteForm.valid) {
      const formularioValores = this.pacienteForm.getRawValue();

      if (this.esModoEdicion()) {
        const passConfirmacion = prompt(
          '🔐 Confirmación de Seguridad:\nPor favor, ingrese SU contraseña para autorizar los cambios en este paciente:'
        );

        if (passConfirmacion === null) return;

        if (!passConfirmacion.trim()) {
          alert('🚫 Operación cancelada: Debe introducir su clave personal.');
          return;
        }

        const payloadActualizar = {
          nombre: formularioValores.nombre!,
          apellidos: formularioValores.apellidos!,
          fec_nac: formularioValores.fec_nac!,
          fechaNacimiento: formularioValores.fec_nac!,
          sexo: formularioValores.sexo!,
          telefono: formularioValores.telefono!,
          tipoSeguro: formularioValores.tipo_seguro!,
          grupoSanguineo: formularioValores.grupo_sanguineo!,
          passwordOperador: passConfirmacion
        };

        this.pacienteService.actualizarPaciente(formularioValores.dni!, payloadActualizar).subscribe({
          next: () => {
            alert('✅ Datos del paciente actualizados correctamente.');
            this.cargarPacientes();
            this.mostrarModal.set(false);
          },
          error: (err) => {
            console.error(err);
            alert('❌ Error al actualizar: ' + (err.error?.error || err.error?.message || 'No autorizado.'));
          }
        });

      } else {
        const nuevoPaciente = {
          dni: formularioValores.dni!,
          nombre: formularioValores.nombre!,
          apellidos: formularioValores.apellidos!,
          fec_nac: formularioValores.fec_nac!,
          fechaNacimiento: formularioValores.fec_nac!,
          sexo: formularioValores.sexo!,
          telefono: formularioValores.telefono!,
          tipoSeguro: formularioValores.tipo_seguro!,
          grupoSanguineo: formularioValores.grupo_sanguineo!
        };

        this.pacienteService.crearPaciente(nuevoPaciente as any).subscribe({
          next: () => {
            alert('✅ Paciente registrado exitosamente.');
            this.cargarPacientes();
            this.pacienteForm.reset({ tipo_seguro: 'TITULAR' });
            this.mostrarModal.set(false);
          },
          error: (err) => {
            alert('Error al registrar: ' + (err.error?.error || err.error?.message));
          }
        });
      }
    }
  }

  onEliminarPaciente(dni: string): void {
    const confirmarCaja = confirm(
      `⚠️ ¿Está seguro de que desea eliminar al paciente con DNI ${dni}?\nEsta acción es irreversible.`
    );

    if (confirmarCaja) {
      const passConfirmacion = prompt(
        '🔐 Autorización Requerida:\nIngrese SU contraseña personal para proceder con la eliminación:'
      );

      if (passConfirmacion === null) return;

      if (!passConfirmacion.trim()) {
        alert('🚫 Operación cancelada: Requiere contraseña del operador.');
        return;
      }

      this.pacienteService.eliminarPaciente(dni, passConfirmacion).subscribe({
        next: () => {
          alert('🗑️ Paciente eliminado del sistema de forma exitosa.');
          this.pacientes.update(lista => lista.filter(p => p.dni !== dni));
        },
        error: (err) => {
          console.error(err);
          alert('❌ Error al eliminar: ' + (err.error?.error || 'No autorizado'));
        }
      });
    }
  }
}
