import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '../shared/config/api.config';

export interface ResumenReportes {
  totalPacientes: number;
  totalPersonal: number;
  citasPendientes: number;
  citasCompletadas: number;
  citasCanceladas: number;
  totalConsultas: number;
  medicamentosBajoStock: number;
  medicamentosPorVencer: number;
}

export interface CitaReporte {
  idCita: number;
  dniPaciente: string;
  paciente: string;
  medico: string;
  especialidad: string | null;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

export interface PersonalReporte {
  dni: string;
  nombre: string;
  apellidos: string;
  rol: string;
  colegiatura: string | null;
  especialidad: string | null;
}

export interface ConsultaReporte {
  idConsulta: number;
  idCita: number;
  dniPaciente: string;
  paciente: string;
  medico: string;
  especialidad: string | null;
  diagnostico: string;
  observaciones: string | null;
  fechaAtencion: string;
  estadoCita: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private http = inject(HttpClient);
  private apiUrl = API_ENDPOINTS.reportes;

  private crearParamsBase(): HttpParams {
    return new HttpParams().set('_t', Date.now().toString());
  }

  obtenerResumen() {
    return this.http.get<{ ok: boolean; data: ResumenReportes }>(
      `${this.apiUrl}/resumen`,
      { params: this.crearParamsBase() }
    );
  }

  descargarExcelPacientes() {
    return this.http.get(`${this.apiUrl}/pacientes/excel`, {
      responseType: 'blob'
    });
  }

  listarPersonal(rol?: string, idEspecialidad?: string) {
    let params = this.crearParamsBase();

    if (rol && rol !== 'TODOS') {
      params = params.set('rol', rol);
    }

    if (idEspecialidad) {
      params = params.set('idEspecialidad', idEspecialidad);
    }

    return this.http.get<{ ok: boolean; data: PersonalReporte[] }>(
      `${this.apiUrl}/personal`,
      { params }
    );
  }

  descargarExcelPersonal(rol?: string, idEspecialidad?: string) {
    let params = this.crearParamsBase();

    if (rol && rol !== 'TODOS') {
      params = params.set('rol', rol);
    }

    if (idEspecialidad) {
      params = params.set('idEspecialidad', idEspecialidad);
    }

    return this.http.get(`${this.apiUrl}/personal/excel`, {
      params,
      responseType: 'blob'
    });
  }

  listarConsultas(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string
  ) {
    let params = this.crearParamsBase();

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    if (idEspecialidad) {
      params = params.set('idEspecialidad', idEspecialidad);
    }

    return this.http.get<{ ok: boolean; data: ConsultaReporte[] }>(
      `${this.apiUrl}/consultas`,
      { params }
    );
  }

  descargarExcelConsultas(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string
  ) {
    let params = this.crearParamsBase();

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    if (idEspecialidad) {
      params = params.set('idEspecialidad', idEspecialidad);
    }

    return this.http.get(`${this.apiUrl}/consultas/excel`, {
      params,
      responseType: 'blob'
    });
  }

  descargarExcelMedicamentosBajoStock() {
    return this.http.get(`${this.apiUrl}/medicamentos/bajo-stock/excel`, {
      params: this.crearParamsBase(),
      responseType: 'blob'
    });
  }

  descargarExcelMedicamentosPorVencer() {
    return this.http.get(`${this.apiUrl}/medicamentos/por-vencer/excel`, {
      params: this.crearParamsBase(),
      responseType: 'blob'
    });
  }

  listarCitas(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string,
    estado?: string
  ) {
    let params = this.crearParamsBase();

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    if (idEspecialidad) {
      params = params.set('idEspecialidad', idEspecialidad);
    }

    if (estado && estado !== 'TODAS') {
      params = params.set('estado', estado);
    }

    return this.http.get<{ ok: boolean; data: CitaReporte[] }>(
      `${this.apiUrl}/citas`,
      { params }
    );
  }

  descargarExcelCitas(
    fechaInicio?: string,
    fechaFin?: string,
    idEspecialidad?: string,
    estado?: string
  ) {
    let params = this.crearParamsBase();

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    if (idEspecialidad) {
      params = params.set('idEspecialidad', idEspecialidad);
    }

    if (estado && estado !== 'TODAS') {
      params = params.set('estado', estado);
    }

    return this.http.get(`${this.apiUrl}/citas/excel`, {
      params,
      responseType: 'blob'
    });
  }
}