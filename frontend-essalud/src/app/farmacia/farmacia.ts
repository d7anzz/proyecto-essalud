import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FarmaciaService } from './farmacia.service';

export interface Medicamento {
  idMedicamento: number;
  nombreMedicamento: string;
  composicion: string;
  stockActual: number;
  stockMinimo: number;
  fechaVencimiento: string;
}

export interface RecetaPendiente {
  idOrden: number;
  idConsulta: number;
  idCita: number;
  dniPaciente: string;
  idMedicamento: number;
  nombreMedicamento: string;
  cantidadRecetada: number;
  estadoEntrega: 'PENDIENTE' | 'ENTREGADO';
}

@Component({
  selector: 'app-farmacia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './farmacia.html',
  styleUrls: ['./farmacia.css']
})
export class FarmaciaComponent implements OnInit {
  // Listas de persistencia de datos maestro
  inventario: Medicamento[] = [];
  recetasPendientes: RecetaPendiente[] = []; // Contenedor del pool total de la API
  recetasFiltradas: RecetaPendiente[] = [];  // Lista recolectora para la vista

  // Variables de control de UI de Secciones Primarias
  mostrarModalAbastecer = false;
  cargando = false;
  vistaActual: 'RECETAS' | 'INVENTARIO' = 'RECETAS';

  // Control de sub-tabs internos para despacho
  tabRecetas: 'pendientes' | 'entregadas' = 'pendientes';

  // Mensajería institucional
  mensaje = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  // Buscador y Formularios
  dniBusqueda = '';
  formMedicamento: any = this.formMedicamentoVacio();
  fechaMinimaParaIngreso = '';

  constructor(
    private service: FarmaciaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.establecerFechaMinima();
    this.verificarAccessoFarmacia();
  }

  private establecerFechaMinima(): void {
    const fechaLimite = new Date();
    // Sumamos 2 meses requeridos por la regla de negocio institucional
    fechaLimite.setMonth(fechaLimite.getMonth() + 2);

    const anio = fechaLimite.getFullYear();
    const mes = String(fechaLimite.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaLimite.getDate()).padStart(2, '0');

    this.fechaMinimaParaIngreso = `${anio}-${mes}-${dia}`;
  }

  private formMedicamentoVacio() {
    return {
      nombreMedicamento: '',
      composicion: '',
      amountIngreso: 1,
      cantidadIngreso: 1,
      stockMinimo: 10,
      fechaVencimiento: ''
    };
  }

  verificarAccessoFarmacia(): void {
    try {
      const token = localStorage.getItem('essalud_token');
      if (!token) { this.bloquearAcceso(); return; }

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payloadDecodificado = JSON.parse(window.atob(base64));

      const rolEncontrado = Number(payloadDecodificado.id_rol || payloadDecodificado.idRol || payloadDecodificado.rol || localStorage.getItem('essalud_rol'));

      if (rolEncontrado !== 3) {
        this.bloquearAcceso();
        return;
      }

      this.cargarRecetas();
    } catch (error) {
      this.bloquearAcceso();
    }
  }

  private bloquearAcceso(): void {
    this.router.navigate(['/dashboard/inicio']);
  }

  // Cargar y distribuir recetas según el tab activo
  cargarRecetas(): void {
    this.cargando = true;
    this.recetasFiltradas = [];
    this.cdr.detectChanges();

    this.service.listarRecetasPendientes(this.dniBusqueda).subscribe({
      next: (res) => {
        this.recetasPendientes = res.data || [];

        // Filtrado según el sub-tab seleccionado
        this.recetasFiltradas = this.recetasPendientes.filter((r: RecetaPendiente) => {
          const estado = String(r.estadoEntrega || '').toUpperCase().trim();

          if (this.tabRecetas === 'pendientes') {
            return estado === 'PENDIENTE';
          } else {
            return estado === 'ENTREGADO' || estado === 'ENTREGADA';
          }
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err?.error?.mensaje || 'Error al conectar con la bandeja de recetas de EsSalud';
        this.mostrarMensaje(msg, 'error');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Conmutador de sub-pestañas de despacho
  cambiarTabRecetas(tab: 'pendientes' | 'entregadas'): void {
    this.tabRecetas = tab;
    this.cargarRecetas();
  }

  // Despachar acto médico
  despacharMedicamento(receta: RecetaPendiente): void {
    if (!confirm(`¿Confirmar la entrega de ${receta.cantidadRecetada} unidades de ${receta.nombreMedicamento} al paciente?`)) return;

    const payloadDespacho = {
      idOrden: receta.idOrden,
      idMedicamento: receta.idMedicamento,
      cantidadEntregada: receta.cantidadRecetada
    };

    this.service.entregarReceta(payloadDespacho).subscribe({
      next: (res) => {
        this.mostrarMensaje(res.mensaje || 'Medicamento entregado. Inventario MySQL actualizado.');
        this.cargarRecetas();
      },
      error: (err) => {
        const msg = err?.error?.mensaje || 'Error al procesar el despacho de insumos';
        this.mostrarMensaje(msg, 'error');
      }
    });
  }

  // Inventario maestro
  cargarInventario(): void {
    this.inventario = [];
    this.cdr.detectChanges();

    this.service.obtenerInventario().subscribe({
      next: (res) => {
        this.inventario = res.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err?.error?.mensaje || 'Error al recuperar el inventario de farmacia';
        this.mostrarMensaje(msg, 'error');
      }
    });
  }

  guardarMedicamento(): void {
    if (this.formMedicamento.fechaVencimiento < this.fechaMinimaParaIngreso) {
      this.mostrarMensaje('La fecha de vencimiento debe ser mayor a 2 meses', 'error');
      return;
    }

    const payloadNuevoMedicamento = {
      nombreMedicamento: this.formMedicamento.nombreMedicamento,
      composicion: this.formMedicamento.composicion,
      cantidadIngreso: Number(this.formMedicamento.cantidadIngreso),
      stockMinimo: Number(this.formMedicamento.stockMinimo),
      fechaVencimiento: this.formMedicamento.fechaVencimiento
    };

    this.service.agregarMedicamento(payloadNuevoMedicamento).subscribe({
      next: () => {
        this.cerrarModal();
        this.mostrarMensaje('Lote de medicamento ingresado al stock correctamente');
        this.cargarInventario();
      },
      error: (err) => {
        const msg = err?.error?.mensaje || 'Error al guardar el medicamento en el inventario';
        this.mostrarMensaje(msg, 'error');
      }
    });
  }

  // Conmutadores de vista principal (Inventario vs Recetas)
  cambiarVista(vista: 'RECETAS' | 'INVENTARIO'): void {
    this.vistaActual = vista;
    if (vista === 'RECETAS') {
      this.cargarRecetas();
    } else {
      this.cargarInventario();
    }
  }

  abrirModalAbastecer(): void {
    this.formMedicamento = this.formMedicamentoVacio();
    this.mostrarModalAbastecer = true;
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModalAbastecer = false;
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