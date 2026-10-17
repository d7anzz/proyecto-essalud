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
    canActivate: [authGuard],
    children: [
      { path: 'inicio', component: InicioComponent },

      { path: 'pacientes', component: PacienteComponent, data: { roles: [1, 2, 4] } },

      { path: 'citas', component: GestionCitasComponent, data: { roles: [1, 2, 4] } },

      { path: 'diagnosticos', component: DiagnosticosComponent, data: { roles: [1, 4] } },

      { path: 'farmacia', component: FarmaciaComponent, data: { roles: [3, 4] } },

      { path: 'registro', component: RegistroComponent, data: { roles: [2, 4] } },

      { path: 'horarios', component: RegistroHorarioComponent, data: { roles: [1] } },

      { path: 'reportes', component: ReportesComponent, data: { roles: [2, 4] } },

      { path: 'historias', component: HistoriasComponent, data: { roles: [1, 2, 4] } },

      { path: 'perfil', component: PerfilComponent },

      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ],
  },

  { path: '**', redirectTo: 'login' }
];