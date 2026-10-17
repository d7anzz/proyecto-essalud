import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoriasService, HistoriaClinica } from './historias.service';

@Component({
  selector: 'app-historias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historias.html',
  styleUrls: ['./historias.css']
})
export class HistoriasComponent implements OnInit {
  private historiasService = inject(HistoriasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  dniBusqueda = signal<string>('');
  historia = signal<HistoriaClinica | null>(null);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  vieneDesdePacientes = signal<boolean>(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const dni = params.get('dni');

      if (dni && /^[0-9]{8}$/.test(dni)) {
        this.vieneDesdePacientes.set(true);
        this.dniBusqueda.set(dni);
        this.buscarHistoria();
      }
    });
  }

  buscarHistoria(): void {
    const dni = this.dniBusqueda().trim();

    this.error.set(null);
    this.historia.set(null);

    if (!/^[0-9]{8}$/.test(dni)) {
      this.error.set('Ingrese un DNI válido de 8 dígitos.');
      return;
    }

    this.cargando.set(true);

    this.historiasService.obtenerHistoriaPorDni(dni).subscribe({
      next: (response) => {
        this.historia.set(response.data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('[HistoriasComponent] Error:', err);

        this.error.set(
          err.error?.message || 'No se pudo obtener la historia clínica del paciente.'
        );

        this.cargando.set(false);
      }
    });
  }

  limpiar(): void {
    this.dniBusqueda.set('');
    this.historia.set(null);
    this.error.set(null);
    this.vieneDesdePacientes.set(false);
  }

  volverPacientes(): void {
    this.router.navigate(['/dashboard/pacientes']);
  }
}
