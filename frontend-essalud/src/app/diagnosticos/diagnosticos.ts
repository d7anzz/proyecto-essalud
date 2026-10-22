import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DiagnosticosService } from './diagnosticos.service';

export interface PacienteNavegacion {
  idCita: number;
  dniPaciente: string;
  pacienteNombre: string;
}

export interface MedicamentoCatalogo {
  idMedicamento: number;
  nombreMedicamento: string;
  composicion: string;
  stockActual: number;
}

export interface FilaReceta {
  idMedicamento: number;
  nombreMedicamento: string;
  cantidadRecetada: number;
}

@Component({
  selector: 'app-diagnosticos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './diagnosticos.html',
  styleUrls: ['./diagnosticos.css']
})
export class DiagnosticosComponent implements OnInit {
  idMedicoLogueado = '';
  catalogoMedicamentos: MedicamentoCatalogo[] = [];
  pacienteEnConsulta: PacienteNavegacion | null = null;

  formConsulta = this.limpiarFormularioConsulta();

  nombreMedicamentoBuscado: string = '';
  cantidadAPrescribir: number = 1;

  mensaje = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  // Variable de control para la visibilidad del dropdown personalizado
  mostrarDropdown = false;

  constructor(
    private service: DiagnosticosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const navegacionActual = this.router.getCurrentNavigation();
    if (navegacionActual?.extras.state) {
      this.pacienteEnConsulta = navegacionActual.extras.state as PacienteNavegacion;
    }
  }

  ngOnInit(): void {
    if (!this.pacienteEnConsulta) {
      this.router.navigate(['/dashboard/citas']);
      return;
    }
    this.verificarAccesoYObtenerCatalogo();
  }

  private limpiarFormularioConsulta() {
    return {
      diagnostico: '',
      observaciones: '',
      medicamentos: [] as FilaReceta[]
    };
  }

  verificarAccesoYObtenerCatalogo(): void {
    try {
      const token = localStorage.getItem('essalud_token');
      if (!token) { this.router.navigate(['/login']); return; }

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payloadDecodificado = JSON.parse(window.atob(base64));

      const rolEncontrado = Number(payloadDecodificado.id_rol || payloadDecodificado.idRol || payloadDecodificado.rol);
      this.idMedicoLogueado = payloadDecodificado.dni || payloadDecodificado.idMedico || '';

      if (rolEncontrado !== 1 && rolEncontrado !== 4) {
        this.router.navigate(['/dashboard/inicio']);
        return;
      }

      this.cargarCatalogoInsumos();
    } catch (error) {
      this.router.navigate(['/dashboard/inicio']);
    }
  }

  cargarCatalogoInsumos(): void {
    this.service.obtenerCatalogoMedicamentos().subscribe({
      next: (res) => {
        this.catalogoMedicamentos = res.data || [];
        console.log('Medicamentos cargados en farmacia:', this.catalogoMedicamentos);
        this.cdr.detectChanges();
      }
    });
  }

  // Filtra el catálogo en tiempo real por Nombre o Composición Química
  filtrarMedicamentos(): MedicamentoCatalogo[] {
    const busqueda = this.nombreMedicamentoBuscado.trim().toLowerCase();
    if (!busqueda) {
      return this.catalogoMedicamentos;
    }
    return this.catalogoMedicamentos.filter(m =>
      (m.nombreMedicamento && m.nombreMedicamento.toLowerCase().includes(busqueda)) ||
      (m.composicion && m.composicion.toLowerCase().includes(busqueda))
    );
  }

  // Captura la selección del dropdown
  seleccionarMedicamentoDropdown(med: MedicamentoCatalogo): void {
    if (med.stockActual <= 0) return;
    this.nombreMedicamentoBuscado = med.nombreMedicamento;
    this.mostrarDropdown = false;
    this.cdr.detectChanges();
  }

  // Retraso preventivo para que el click se procese antes del blur
  ocultarDropdownConRetraso(): void {
    setTimeout(() => {
      this.mostrarDropdown = false;
      this.cdr.detectChanges();
    }, 200);
  }

  agregarMedicamentoAReceta(): void {
    const textoBuscado = this.nombreMedicamentoBuscado.trim().toLowerCase();

    if (!textoBuscado || this.cantidadAPrescribir <= 0) {
      this.mostrarMensaje('Escriba o seleccione un medicamento válido.', 'error');
      return;
    }

    const medElegido = this.catalogoMedicamentos.find(m => {
      if (!m.nombreMedicamento) return false;
      const nombreFormateado = m.nombreMedicamento.toLowerCase().trim();
      return nombreFormateado === textoBuscado || nombreFormateado.includes(textoBuscado);
    });

    if (!medElegido) {
      this.mostrarMensaje('El medicamento escrito no coincide con ningún fármaco en stock.', 'error');
      return;
    }

    if (this.cantidadAPrescribir > medElegido.stockActual) {
      this.mostrarMensaje(`Stock insuficiente en farmacia. Solo quedan ${medElegido.stockActual} unidades.`, 'error');
      return;
    }

    const existe = this.formConsulta.medicamentos.find((m: FilaReceta) => m.idMedicamento === medElegido.idMedicamento);
    if (existe) {
      existe.cantidadRecetada += Number(this.cantidadAPrescribir);
    } else {
      this.formConsulta.medicamentos.push({
        idMedicamento: medElegido.idMedicamento,
        nombreMedicamento: medElegido.nombreMedicamento,
        cantidadRecetada: Number(this.cantidadAPrescribir)
      });
    }

    this.nombreMedicamentoBuscado = '';
    this.cantidadAPrescribir = 1;
    this.cdr.detectChanges();
  }

  quitarMedicamento(index: number): void {
    this.formConsulta.medicamentos.splice(index, 1);
    this.cdr.detectChanges();
  }

  guardarActoMedico(): void {
    if (!this.pacienteEnConsulta) return;

    if (!this.formConsulta.diagnostico || this.formConsulta.diagnostico.trim().length < 5) {
      this.mostrarMensaje('El diagnóstico debe tener entre 5 y 1000 caracteres', 'error');
      return;
    }

    const payloadFinal = {
      idCita: this.pacienteEnConsulta.idCita,
      dniPaciente: this.pacienteEnConsulta.dniPaciente,
      idMedico: this.idMedicoLogueado,
      diagnostico: this.formConsulta.diagnostico.trim(),
      observaciones: this.formConsulta.observaciones.trim(),
      medicamentos: this.formConsulta.medicamentos.map((m: FilaReceta) => ({
        idMedicamento: m.idMedicamento,
        cantidadRecetada: m.cantidadRecetada
      }))
    };

    this.service.registrarActoMedico(payloadFinal).subscribe({
      next: (res) => {
        alert(res.mensaje || 'Acto médico registrado.');
        this.router.navigate(['/dashboard/citas']);
      },
      error: (err) => {
        this.mostrarMensaje(err?.error?.mensaje || 'Error al procesar la receta.', 'error');
      }
    });
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error' = 'exito'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    this.cdr.detectChanges();
    setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 4000);
  }
}