import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroHorarioService, Horario } from './horarios.service';

interface DiaSemanaEstructural {
  nombre: string;
  fechaFormateada: string;
  fechaVisual: string;
  horarios: Horario[];
}

@Component({
  selector: 'app-registro-horario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios.html',
  styleUrls: ['./horarios.css']
})
export class RegistroHorarioComponent implements OnInit {
  horarios: Horario[] = [];
  mostrarModal = false;
  mensaje = '';
  tipoMensaje: 'exito' | 'error' = 'exito';
  turnosOpciones: Array<'MAÑANA' | 'TARDE' | 'NOCHE'> = ['MAÑANA', 'TARDE', 'NOCHE'];
  form: any = this.formVacio();
  esMedico = true;

  agendaSemanal: DiaSemanaEstructural[] = [];

  fechaFiltro: Date = new Date();
  rangoSemanaTexto = '';
  hoyTexto = '';
  fechaMinimaParaCrear = '';
  fechaLimiteParaModificar = '';

  constructor(
    private service: RegistroHorarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.calcularLimitesDeTiempo();
    this.verificarAccAccess();
  }

  private calcularLimitesDeTiempo(): void {
    const ahora = new Date();
    const aAnio = ahora.getFullYear();
    const aMes = String(ahora.getMonth() + 1).padStart(2, '0');
    const aDia = String(ahora.getDate()).padStart(2, '0');
    this.hoyTexto = `${aAnio}-${aMes}-${aDia}`;

    const limiteCrear = new Date(aAnio, ahora.getMonth(), ahora.getDate() + 2);
    this.fechaMinimaParaCrear = this.formatearFechaISO(limiteCrear);

    const limiteModificar = new Date(aAnio, ahora.getMonth(), ahora.getDate() + 2);
    this.fechaLimiteParaModificar = this.formatearFechaISO(limiteModificar);
  }

  private formatearFechaISO(f: Date): string {
    const anio = f.getFullYear();
    const mes = String(f.getMonth() + 1).padStart(2, '0');
    const dia = String(f.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  verificarAccAccess(): void {
    try {
      const token = localStorage.getItem('essalud_token');
      if (!token) { this.bloquearAcceso(); return; }

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payloadDecodificado = JSON.parse(window.atob(base64));

      const rolEncontrado = Number(payloadDecodificado.id_rol || payloadDecodificado.idRol || payloadDecodificado.rol || localStorage.getItem('essalud_rol'));

      const ROLES_PERMITIDOS_VISTA = [1, 2, 4];
      if (!ROLES_PERMITIDOS_VISTA.includes(rolEncontrado)) {
        this.bloquearAcceso();
        return;
      }

      this.esMedico = rolEncontrado === 1;
      this.cargar();
    } catch (error) {
      this.bloquearAcceso();
    }
  }

  private bloquearAcceso(): void {
    this.router.navigate(['/dashboard/inicio']);
  }

  formVacio() {
    return {
      dni: '',
      fecha: '',
      horaInicio: '07:00',
      turno: 'MAÑANA',
      cantidadPacientes: 1
    };
  }

  cargar(): void {
    this.horarios = [];
    this.armarAgendaSemanal();
    this.cdr.detectChanges();

    this.service.listar().subscribe({
      next: (res) => {
        this.horarios = res.data;
        this.armarAgendaSemanal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err?.error?.mensaje || 'Error al sincronizar las guardias con EsSalud';
        this.mostrarMensaje(msg, 'error');
      }
    });
  }

  armarAgendaSemanal(): void {
    const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    this.agendaSemanal = [];

    const copiaPivote = new Date(this.fechaFiltro.getFullYear(), this.fechaFiltro.getMonth(), this.fechaFiltro.getDate());
    const numeroDia = copiaPivote.getDay();
    const diferenciaAlLunes = numeroDia === 0 ? -6 : 1 - numeroDia;

    const lunesSemana = new Date(copiaPivote.setDate(copiaPivote.getDate() + diferenciaAlLunes));

    this.agendaSemanal = nombresDias.map((nombre, index) => {
      const fechaDia = new Date(lunesSemana.getFullYear(), lunesSemana.getMonth(), lunesSemana.getDate() + index);
      const mes = String(fechaDia.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaDia.getDate()).padStart(2, '0');

      return {
        nombre,
        fechaFormateada: `${fechaDia.getFullYear()}-${mes}-${dia}`,
        fechaVisual: `${dia}/${mes}`,
        horarios: []
      };
    });

    if (this.horarios && this.horarios.length > 0) {
      const mapaAgrupado: { [key: string]: Horario[] } = {};

      this.horarios.forEach(horario => {
        if (!horario.fecha) return;
        const llaveClave = `${horario.fecha}_${horario.turno}`;
        if (!mapaAgrupado[llaveClave]) {
          mapaAgrupado[llaveClave] = [];
        }
        mapaAgrupado[llaveClave].push(horario);
      });

      Object.keys(mapaAgrupado).forEach(llave => {
        const subBloques = mapaAgrupado[llave];
        subBloques.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

        const primerBloque = subBloques[0];
        const ultimoBloque = subBloques[subBloques.length - 1];

        const tarjetaConsolidada: Horario = {
          id: primerBloque.id,
          dni: primerBloque.dni,
          fecha: primerBloque.fecha,
          turno: primerBloque.turno,
          personal: primerBloque.personal,
          horaInicio: primerBloque.horaInicio,
          horaFin: ultimoBloque.horaFin,
          estado: subBloques.some(b => b.estado === 'DISPONIBLE' || b.estado === true) ? 'DISPONIBLE' : 'OCUPADO',
          subBloquesReales: subBloques
        };

        const coincidencia = this.agendaSemanal.find(d => d.fechaFormateada === tarjetaConsolidada.fecha);
        if (coincidencia) {
          coincidencia.horarios.push(tarjetaConsolidada);
        }
      });

      this.agendaSemanal.forEach(dia => {
        dia.horarios.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
      });
    }

    this.rangoSemanaTexto = `Semana del ${this.agendaSemanal[0].fechaVisual} al ${this.agendaSemanal[6].fechaVisual}`;
  }

  navegarSemana(direccion: number): void {
    this.fechaFiltro.setDate(this.fechaFiltro.getDate() + (direccion * 7));
    this.armarAgendaSemanal();
    this.cdr.detectChanges();
  }

  onTurnoChange(): void {
    if (this.form.turno === 'MAÑANA') { this.form.horaInicio = '07:00'; }
    else if (this.form.turno === 'TARDE') { this.form.horaInicio = '13:00'; }
    else if (this.form.turno === 'NOCHE') { this.form.horaInicio = '19:00'; }
    this.cdr.detectChanges();
  }

  abrirCrearEnFecha(fechaDia: string): void {
    if (!this.esMedico) return;

    if (fechaDia < this.fechaMinimaParaCrear) {
      this.mostrarMensaje('🚫 Regla Institucional: Los turnos asistenciales deben registrarse con un mínimo de 2 días (48h) de anticipación.', 'error');
      return;
    }

    this.form = this.formVacio();
    this.form.fecha = fechaDia;
    this.onTurnoChange();

    try {
      const token = localStorage.getItem('essalud_token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payloadDecodificado = JSON.parse(window.atob(base64));
        this.form.dni = payloadDecodificado.dni || '';
      }
    } catch (e) {
      console.error(e);
    }

    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  guardar(): void {
    if (!this.esMedico) return;

    if (this.form.fecha < this.fechaMinimaParaCrear) {
      this.mostrarMensaje('🚫 Fecha inválida: No cumple con los 2 días mínimos de anticipación.', 'error');
      return;
    }

    const payloadCrear = {
      dni: this.form.dni,
      fecha: this.form.fecha,
      horaInicio: this.form.horaInicio,
      turno: this.form.turno,
      cantidadPacientes: Number(this.form.cantidadPacientes)
    };

    this.service.crear(payloadCrear).subscribe({
      next: () => {
        this.cerrarModal();
        this.mostrarMensaje('Guardia registrada correctamente');
        this.cargar();
      },
      error: (err) => {
        const msg = err?.error?.mensaje || 'Error al procesar el registro';
        this.mostrarMensaje(msg, 'error');
      }
    });
  }

  eliminar(horarioConsolidado: any, fechaGuardia: string): void {
    if (!this.esMedico) return;

    if (fechaGuardia < this.fechaLimiteParaModificar) {
      this.mostrarMensaje('🚫 Acción denegada: No se puede dar de baja un turno con menos de 2 días de anticipación.', 'error');
      return;
    }

    if (!confirm(`¿Desea eliminar la agenda completa de este turno (${horarioConsolidado.turno})?`)) return;

    const bloquesABorrar: any[] = horarioConsolidado.subBloquesReales || [horarioConsolidado];

    let completados = 0;
    bloquesABorrar.forEach(b => {
      this.service.eliminar(b.id).subscribe({
        next: () => {
          completados++;
          if (completados === bloquesABorrar.length) {
            this.mostrarMensaje('Agenda del turno eliminada por completo');
            this.cargar();
          }
        }
      });
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cdr.detectChanges();
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
