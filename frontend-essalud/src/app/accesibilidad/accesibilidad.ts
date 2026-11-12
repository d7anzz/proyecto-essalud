import { Component, inject, signal } from '@angular/core';
import { AccesibilidadService } from './accesibilidad.service';

@Component({
  selector: 'app-accesibilidad',
  standalone: true,
  templateUrl: './accesibilidad.html',
  styleUrl: './accesibilidad.css'
})
export class AccesibilidadComponent {
  accService = inject(AccesibilidadService);
  menuAbierto = signal<boolean>(false);

  toggleMenu(): void {
    this.menuAbierto.update(v => !v);
  }
}
