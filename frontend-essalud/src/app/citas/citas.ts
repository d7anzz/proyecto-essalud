import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService, Cita } from './citas.service';
import { RegistroHorarioService } from '../horarios/horarios.service';
import { PacienteService } from '../paciente/paciente.service';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrls: ['./citas.css']
})
export class GestionCitasComponent implements OnInit {
  // 📋 Listas de Persistencia de Citas
  citas: Cita[] = [];          // Contenedor global o vista administrativa
  citasFiltradas: any[] = [];  // 🚀 Renderiza de forma dinámica en la tabla
  todosLosHorarios: any[] = [];

  especialidades: string[] = [];
  medicosFiltrados: any[] = [];
  fechasFiltradas: string[] = [];
  horariosFinales: any[] = [];

  pacientesEncontrados: any[] = [];
  mostrarDropdownPacientes = false;
  pacienteSeleccionadoTexto = '';

  mostrarModalAgendar = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' = 'exito';
  fechaMinima = '';

  form = {
    dniPaciente: '',
    especialidad: '',
    dniMedico: '',
    fecha: '',
    idHorario: ''
  };

  // 🛡️ Propiedades de Sesión Institucional
  idRolUsuario = 0;
  esAdministrativo = false;
  dniUsuarioLogueado = '';

  // 📑 Control Clínico de Pestañas (Corregido sin caracteres especiales)
  pestanaActiva: 'pendientes' | 'completadas' = 'pendientes';

  constructor(
    private citaService: CitaService,
    private horarioService: RegistroHorarioService,
    private pacienteService: PacienteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.idRolUsuario = Number(localStorage.getItem('essalud_rol') || 0);
    this.esAdministrativo = (this.idRolUsuario === 2);

    try {
      const token = localStorage.getItem('essalud_token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payloadDecodificado = JSON.parse(window.atob(base64));
        this.dniUsuarioLogueado = payloadDecodificado.dni || payloadDecodificado.idMedico || payloadDecodificado.sub || '';
      }
    } catch (error) {
      console.error('Error al decodificar el token en citas:', error);
      this.dniUsuarioLogueado = '';
    }

    if (!this.dniUsuarioLogueado) {
      this.dniUsuarioLogueado = localStorage.getItem('essalud_dni') || '';
    }

    this.establecerFechaMinima();
    this.cargarCitas();

    if (this.esAdministrativo || this.idRolUsuario === 4) {
      this.cargarDataMaestraHorarios();
    }
  }

  establecerFechaMinima(): void {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    this.fechaMinima = `${anio}-${mes}-${dia}`;
  }

  cargarCitas(): void {
    this.citaService.listar().subscribe({
      next: (res) => {
        const dataOriginal = res.data || [];
        this.citas = dataOriginal;

        if (dataOriginal.length > 0) {
          console.log('--- AUDITORÍA DE DATOS DE CITA ---');
          console.log('Tu DNI Logueado es:', this.dniUsuarioLogueado);
        }

        // 🩺 FILTRADO ESTRATÉGICO POR PESTAÑAS PARA EL MÉDICO (ROL 1)
        if (this.idRolUsuario === 1) {
          this.citasFiltradas = dataOriginal.filter((c: any) => {
            const dniMedicoEnCita = c.idMedico || c.dniMedico;
            const esMiCita = (dniMedicoEnCita == this.dniUsuarioLogueado);

            const estadoActual = c.estado || c.estado_cita || '';

            // Evaluamos según la propiedad sanitizada 'pestanaActiva'
            if (this.pestanaActiva === 'pendientes') {
              return esMiCita && estadoActual === 'PENDIENTE';
            } else {
              return esMiCita && (estadoActual === 'COMPLETADA' || estadoActual === 'ATENDIDO');
            }
          });
        } else {
          // Si es Administrativo o Auditor, hereda todo el bloque plano sin filtros
          this.citasFiltradas = dataOriginal;
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mostrarMensaje(err?.error?.mensaje || 'Error al cargar el listado de citas', 'error');
      }
    });
  }

  // 🔁 Conmutador de Pestañas en Tiempo Real (Sincronizado con el HTML)
  cambiarPestana(pestana: 'pendientes' | 'completadas'): void {
    this.pestanaActiva = pestana;
    this.cargarCitas();
  }

  atenderCitaEnConsulta(cita: any): void {
    this.router.navigate(['/dashboard/diagnosticos'], {
      state: {
        idCita: cita.idCita,
        dniPaciente: cita.dniPaciente,
        pacienteNombre: cita.pacienteNombre || (cita.paciente ? `${cita.paciente.nombre} ${cita.paciente.apellidos}` : 'Paciente Asegurado')
      }
    });
  }

  // ===================================================================
  // 💼 GESTIÓN DE HORARIOS Y AGENDAMIENTO (Mantienen su lógica intacta)
  // ===================================================================
  cargarDataMaestraHorarios(): void {
    this.horarioService.listar().subscribe({
      next: (res) => {
        const hoyStr = this.fechaMinima;
        this.todosLosHorarios = (res.data || []).filter((h: any) => {
          const esValido = h.estado === 'DISPONIBLE' || h.estado === true;
          const noEsPasado = h.fecha >= hoyStr;
          return esValido && noEsPasado;
        });

        const despachos = this.todosLosHorarios.map((h: any) => h.personal?.especialidad || 'General');
        this.especialidades = [...new Set(despachos)];
        this.cdr.detectChanges();
      }
    });
  }

  buscarPacientePorDni(event: any): void {
    const query = event.target.value;
    if (query.length < 2) {
      this.pacientesEncontrados = [];
      this.mostrarDropdownPacientes = false;
      return;
    }

    this.pacienteService.buscarPorDni(query).subscribe({
      next: (res) => {
        this.pacientesEncontrados = res.data;
        this.mostrarDropdownPacientes = this.pacientesEncontrados.length > 0;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarPaciente(p: any): void {
    this.form.dniPaciente = p.dni;
    this.pacienteSeleccionadoTexto = `${p.dni} - ${p.nombre} ${p.apellidos}`;
    this.mostrarDropdownPacientes = false;
    this.pacientesEncontrados = [];
    this.cdr.detectChanges();
  }

  alCambiarEspecialidad(): void {
    this.form.dniMedico = '';
    this.form.fecha = '';
    this.form.idHorario = '';
    this.fechasFiltradas = [];
    this.horariosFinales = [];

    const medicosMap = new Map();
    this.todosLosHorarios.forEach((h: any) => {
      const esp = h.personal?.especialidad || 'General';
      if (esp === this.form.especialidad) {
        const dniMed = h.dni;
        const nombreMed = h.personal ? `${h.personal.nombre} ${h.personal.apellidos}` : `Médico DNI: ${h.dni}`;
        medicosMap.set(dniMed, nombreMed);
      }
    });

    this.medicosFiltrados = Array.from(medicosMap, ([dni, nombre]) => ({ dni, nombre }));
    this.cdr.detectChanges();
  }

  alCambiarMedico(): void {
    this.form.fecha = '';
    this.form.idHorario = '';
    this.horariosFinales = [];

    const fechasSet = new Set<string>();
    this.todosLosHorarios.forEach((h: any) => {
      const esp = h.personal?.especialidad || 'General';
      if (esp === this.form.especialidad && h.dni === this.form.dniMedico) {
        fechasSet.add(h.fecha);
      }
    });

    this.fechasFiltradas = Array.from(fechasSet).sort();
    this.cdr.detectChanges();
  }

  alCambiarFecha(): void {
    this.form.idHorario = '';

    this.horariosFinales = this.todosLosHorarios.filter((h: any) => {
      const esp = h.personal?.especialidad || 'General';
      return esp === this.form.especialidad && h.dni === this.form.dniMedico && h.fecha === this.form.fecha;
    }).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    this.cdr.detectChanges();
  }

  abrirModal(): void {
    this.form = { dniPaciente: '', especialidad: '', dniMedico: '', fecha: '', idHorario: '' };
    this.pacienteSeleccionadoTexto = '';
    this.medicosFiltrados = [];
    this.fechasFiltradas = [];
    this.horariosFinales = [];
    this.cargarDataMaestraHorarios();
    this.mostrarModalAgendar = true;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModalAgendar = false;
    this.cdr.detectChanges();
  }

  agendarCita(): void {
    if (!this.form.dniPaciente || !this.form.idHorario) {
      this.mostrarMensaje('Por favor, complete todos los campos obligatorios.', 'error');
      return;
    }

    const payload = {
      dniPaciente: this.form.dniPaciente,
      dniMedico: this.form.dniMedico,
      idHorario: Number(this.form.idHorario)
    };

    this.citaService.crear(payload).subscribe({
      next: () => {
        this.cerrarModal();
        this.mostrarMensaje('Cita médica agendada correctamente');
        this.cargarCitas();
      },
      error: (err) => {
        this.mostrarMensaje(err?.error?.mensaje || 'No se pudo procesar la cita', 'error');
      }
    });
  }

  cambiarEstado(cita: Cita, nuevoEstado: 'COMPLETADA' | 'CANCELADA'): void {
    if (!cita.idCita) return;

    const accion = nuevoEstado === 'CANCELADA' ? 'cancelar' : 'completar';
    if (!confirm(`¿Está seguro de que desea ${accion} esta cita médica?`)) return;

    this.citaService.actualizarEstado(cita.idCita, nuevoEstado).subscribe({
      next: () => {
        this.mostrarMensaje(`Cita marcada como ${nuevoEstado.toLowerCase()} con éxito`);
        this.cargarCitas();
      },
      error: (err) => {
        this.mostrarMensaje(err?.error?.mensaje || 'Error al actualizar el estado', 'error');
      }
    });
  }

  removerFisicamente(idCita: number | undefined): void {
    if (!idCita) return;
    if (!confirm('¿Desea eliminar físicamente el registro de la cita? Se liberará el horario.')) return;

    this.citaService.eliminar(idCita).subscribe({
      next: () => {
        this.mostrarMensaje('Registro de cita removido del sistema');
        this.cargarCitas();
      },
      error: (err) => {
        this.mostrarMensaje(err?.error?.mensaje || 'Error al eliminar la cita', 'error');
      }
    });
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error' = 'exito'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.mensaje = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}
