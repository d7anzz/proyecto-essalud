import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { PacienteComponent } from './paciente/paciente';
import { InicioComponent } from './inicio/inicio';
import { RegistroComponent } from './registro/registro';
import { CambiarPassword } from './cambiar-password/cambiar-password';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './auth/auth.guard';
import { PerfilComponent } from './shared/layouts/dashboard-layout/perfil/perfil';
import { RegistroHorarioComponent } from './horarios/horarios';
import { GestionCitasComponent } from './citas/citas';
import { FarmaciaComponent } from './farmacia/farmacia';
import { DiagnosticosComponent } from './diagnosticos/diagnosticos';
import { ReportesComponent } from './reportes/reportes';
import { HistoriasComponent } from './historias/historias';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Auth },
  { path: 'cambiar-password', component: CambiarPassword },

  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard], // Valida que esté logueado al entrar al dashboard
    children: [
      { path: 'inicio', component: InicioComponent },

      // ¡Aquí está el cambio! Añadimos canActivate en cada hijo que requiera restricción de rol:
      { path: 'pacientes', component: PacienteComponent, canActivate: [authGuard], data: { roles: [1, 2, 4] } },

      { path: 'citas', component: GestionCitasComponent, canActivate: [authGuard], data: { roles: [1, 2, 4] } },

      { path: 'diagnosticos', component: DiagnosticosComponent, canActivate: [authGuard], data: { roles: [1, 4] } },

      { path: 'farmacia', component: FarmaciaComponent, canActivate: [authGuard], data: { roles: [3, 4] } },

      { path: 'registro', component: RegistroComponent, canActivate: [authGuard], data: { roles: [2, 4] } },

      { path: 'horarios', component: RegistroHorarioComponent, canActivate: [authGuard], data: { roles: [1, 2, 4] } },

      { path: 'reportes', component: ReportesComponent, canActivate: [authGuard], data: { roles: [2, 4] } },

      { path: 'historias', component: HistoriasComponent, canActivate: [authGuard], data: { roles: [1, 2, 4] } },

      { path: 'perfil', component: PerfilComponent }, // El perfil es libre para cualquier usuario logueado

      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ],
  },

  { path: '**', redirectTo: 'login' }
];
