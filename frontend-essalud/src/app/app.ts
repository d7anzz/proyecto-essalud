import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccesibilidadComponent } from './accesibilidad/accesibilidad';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AccesibilidadComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
