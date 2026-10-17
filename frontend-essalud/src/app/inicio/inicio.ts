import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent implements OnInit {
  private router = inject(Router);

  // 🎛️ Solo conservamos el idRol para el control de renderizado de las tarjetas (@if)
  idRol = signal<number>(0);

  ngOnInit(): void {
    const token = localStorage.getItem('essalud_token');

    // Si por algún motivo intentan entrar directamente saltándose el Login
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // 🎯 Recuperamos el rol guardado en el login para activar las tarjetas correctas
    const rol = localStorage.getItem('essalud_rol') || '0';
    this.idRol.set(parseInt(rol, 10));

    console.log('🏁 [Inicio] Panel de módulos cargado para el Rol ID:', this.idRol());
  }
}
