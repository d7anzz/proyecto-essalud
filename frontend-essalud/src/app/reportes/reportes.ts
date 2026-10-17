import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ReportesService,
  ResumenReportes,
  CitaReporte,
  PersonalReporte,
  ConsultaReporte
} from './reportes.service';

type ReporteActivo =
  | 'pacientes'
  | 'personal'
  | 'citas'
  | 'consultas'
  | 'bajoStock'
  | 'porVencer';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent implements OnInit {
  private reportesService = inject(ReportesService);

  resumen = signal<ResumenReportes | null>(null);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  reporteActivo: ReporteActivo = 'citas';

  citas: CitaReporte[] = [];
  personal: PersonalReporte[] = [];
  consultas: ConsultaReporte[] = [];

  fechaInicio: string = '';
  fechaFin: string = '';
  idEspecialidad: string = '';
  estadoCita: string = 'TODAS';

  rolPersonal: string = 'TODOS';
  idEspecialidadPersonal: string = '';

  fechaInicioConsulta: string = '';
  fechaFinConsulta: string = '';
  idEspecialidadConsulta: string = '';

  itemsPorPagina: number = 10;

  paginaCitas: number = 1;
  paginaPersonal: number = 1;
  paginaConsultas: number = 1;

  buscoCitas: boolean = false;
  buscoPersonal: boolean = false;
  buscoConsultas: boolean = false;

  ngOnInit(): void {
    this.cargarResumen();
  }

  seleccionarReporte(reporte: ReporteActivo): void {
    this.reporteActivo = reporte;
    this.error.set(null);
  }

  cargarResumen(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.reportesService.obtenerResumen().subscribe({
      next: (res) => {
        this.resumen.set(res.data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('[Reportes] Error cargando resumen:', err);
        this.error.set('No se pudieron cargar los reportes.');
        this.cargando.set(false);
      }
    });
  }

  descargarPacientesExcel(): void {
    this.reportesService.descargarExcelPacientes().subscribe({
      next: (blob) => {
        this.descargarBlob(blob, 'reporte_pacientes.xlsx');
      },
      error: (err) => {
        console.error('[Reportes] Error descargando Excel de pacientes:', err);
        this.error.set('No se pudo descargar el Excel de pacientes.');
      }
    });
  }

  onRolPersonalChange(): void {
    if (this.rolPersonal !== 'MEDICO') {
      this.idEspecialidadPersonal = '';
    }
  }

  buscarPersonal(): void {
    this.error.set(null);
    this.buscoPersonal = true;
    this.paginaPersonal = 1;

    this.reportesService
      .listarPersonal(this.rolPersonal, this.idEspecialidadPersonal)
      .subscribe({
        next: (res) => {
          this.personal = res.data || [];
        },
        error: (err) => {
          console.error('[Reportes] Error buscando personal:', err);
          this.error.set('No se pudo cargar el reporte de personal.');
        }
      });
  }

  limpiarPersonal(): void {
    this.rolPersonal = 'TODOS';
    this.idEspecialidadPersonal = '';
    this.personal = [];
    this.paginaPersonal = 1;
    this.buscoPersonal = false;
    this.error.set(null);
  }

  descargarPersonalExcel(): void {
    this.reportesService
      .descargarExcelPersonal(this.rolPersonal, this.idEspecialidadPersonal)
      .subscribe({
        next: (blob) => {
          this.descargarBlob(
            blob,
            `reporte_personal_${this.rolPersonal || 'TODOS'}.xlsx`
          );
        },
        error: (err) => {
          console.error('[Reportes] Error descargando Excel de personal:', err);
          this.error.set('No se pudo descargar el Excel de personal.');
        }
      });
  }

  buscarCitas(): void {
    this.error.set(null);
    this.buscoCitas = true;
    this.paginaCitas = 1;

    if (!this.fechaInicio) {
      this.fechaInicio = '2026-01-01';
    }

    if (!this.fechaFin) {
      this.fechaFin = '2026-12-31';
    }

    this.reportesService
      .listarCitas(
        this.fechaInicio,
        this.fechaFin,
        this.idEspecialidad,
        this.estadoCita
      )
      .subscribe({
        next: (res) => {
          this.citas = res.data || [];
        },
        error: (err) => {
          console.error('[Reportes] Error buscando citas:', err);
          this.error.set('No se pudo cargar el reporte de citas.');
        }
      });
  }

  limpiarCitas(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.idEspecialidad = '';
    this.estadoCita = 'TODAS';
    this.citas = [];
    this.paginaCitas = 1;
    this.buscoCitas = false;
    this.error.set(null);
  }

  descargarExcel(): void {
    this.reportesService
      .descargarExcelCitas(
        this.fechaInicio,
        this.fechaFin,
        this.idEspecialidad,
        this.estadoCita
      )
      .subscribe({
        next: (blob) => {
          this.descargarBlob(
            blob,
            `reporte_citas_${this.estadoCita}_${this.fechaInicio || 'inicio'}_${this.fechaFin || 'fin'}.xlsx`
          );
        },
        error: (err) => {
          console.error('[Reportes] Error descargando Excel:', err);
          this.error.set('No se pudo descargar el Excel de citas.');
        }
      });
  }

  buscarConsultas(): void {
    this.error.set(null);
    this.buscoConsultas = true;
    this.paginaConsultas = 1;

    if (!this.fechaInicioConsulta) {
      this.fechaInicioConsulta = '2026-01-01';
    }

    if (!this.fechaFinConsulta) {
      this.fechaFinConsulta = '2026-12-31';
    }

    this.reportesService
      .listarConsultas(
        this.fechaInicioConsulta,
        this.fechaFinConsulta,
        this.idEspecialidadConsulta
      )
      .subscribe({
        next: (res) => {
          this.consultas = res.data || [];
        },
        error: (err) => {
          console.error('[Reportes] Error buscando consultas:', err);
          this.error.set('No se pudo cargar el reporte de consultas médicas.');
        }
      });
  }

  limpiarConsultas(): void {
    this.fechaInicioConsulta = '';
    this.fechaFinConsulta = '';
    this.idEspecialidadConsulta = '';
    this.consultas = [];
    this.paginaConsultas = 1;
    this.buscoConsultas = false;
    this.error.set(null);
  }

  descargarConsultasExcel(): void {
    this.reportesService
      .descargarExcelConsultas(
        this.fechaInicioConsulta,
        this.fechaFinConsulta,
        this.idEspecialidadConsulta
      )
      .subscribe({
        next: (blob) => {
          this.descargarBlob(
            blob,
            `reporte_consultas_${this.fechaInicioConsulta || 'inicio'}_${this.fechaFinConsulta || 'fin'}.xlsx`
          );
        },
        error: (err) => {
          console.error('[Reportes] Error descargando Excel de consultas:', err);
          this.error.set('No se pudo descargar el Excel de consultas médicas.');
        }
      });
  }

  descargarMedicamentosBajoStockExcel(): void {
    this.reportesService.descargarExcelMedicamentosBajoStock().subscribe({
      next: (blob) => {
        this.descargarBlob(blob, 'reporte_medicamentos_bajo_stock.xlsx');
      },
      error: (err) => {
        console.error('[Reportes] Error descargando Excel de medicamentos bajo stock:', err);
        this.error.set('No se pudo descargar el Excel de medicamentos bajo stock.');
      }
    });
  }

  descargarMedicamentosPorVencerExcel(): void {
    this.reportesService.descargarExcelMedicamentosPorVencer().subscribe({
      next: (blob) => {
        this.descargarBlob(blob, 'reporte_medicamentos_por_vencer.xlsx');
      },
      error: (err) => {
        console.error('[Reportes] Error descargando Excel de medicamentos por vencer:', err);
        this.error.set('No se pudo descargar el Excel de medicamentos por vencer.');
      }
    });
  }

  get totalPaginasCitas(): number {
    return Math.max(1, Math.ceil(this.citas.length / this.itemsPorPagina));
  }

  get citasPaginadas(): CitaReporte[] {
    const inicio = (this.paginaCitas - 1) * this.itemsPorPagina;
    return this.citas.slice(inicio, inicio + this.itemsPorPagina);
  }

  paginaAnteriorCitas(): void {
    if (this.paginaCitas > 1) {
      this.paginaCitas--;
    }
  }

  paginaSiguienteCitas(): void {
    if (this.paginaCitas < this.totalPaginasCitas) {
      this.paginaCitas++;
    }
  }

  get totalPaginasPersonal(): number {
    return Math.max(1, Math.ceil(this.personal.length / this.itemsPorPagina));
  }

  get personalPaginado(): PersonalReporte[] {
    const inicio = (this.paginaPersonal - 1) * this.itemsPorPagina;
    return this.personal.slice(inicio, inicio + this.itemsPorPagina);
  }

  paginaAnteriorPersonal(): void {
    if (this.paginaPersonal > 1) {
      this.paginaPersonal--;
    }
  }

  paginaSiguientePersonal(): void {
    if (this.paginaPersonal < this.totalPaginasPersonal) {
      this.paginaPersonal++;
    }
  }

  get totalPaginasConsultas(): number {
    return Math.max(1, Math.ceil(this.consultas.length / this.itemsPorPagina));
  }

  get consultasPaginadas(): ConsultaReporte[] {
    const inicio = (this.paginaConsultas - 1) * this.itemsPorPagina;
    return this.consultas.slice(inicio, inicio + this.itemsPorPagina);
  }

  paginaAnteriorConsultas(): void {
    if (this.paginaConsultas > 1) {
      this.paginaConsultas--;
    }
  }

  paginaSiguienteConsultas(): void {
    if (this.paginaConsultas < this.totalPaginasConsultas) {
      this.paginaConsultas++;
    }
  }

  private descargarBlob(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = nombreArchivo;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}