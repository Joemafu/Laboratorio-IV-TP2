import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['bienvenida']);

export const routes: Routes = [
  { 
      path: '', redirectTo: 'bienvenida', pathMatch: 'full'
  },
  { 
      path: 'login',
      loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
      ...canActivate(() => redirectLoggedInToHome()),
  },
  { 
      path: 'perfil',
      loadComponent: () => import('./components/mi-perfil/mi-perfil.component').then(c => c.MiPerfilComponent),
      ...canActivate(() => redirectUnauthorizedToLogin()),
  },  
  { 
    path: 'registrar',
    loadComponent: () => import('./components/registrar-usuario/registrar-usuario.component').then(c => c.RegistrarUsuarioComponent),
  },
  { 
      path: 'bienvenida',
      loadComponent: () => import('./components/bienvenida/bienvenida.component').then(c => c.BienvenidaComponent),
  },
  { 
      path: 'administrar-usuarios',
      loadComponent: () => import('./components/administrar-usuarios/administrar-usuarios.component').then(c => c.AdministrarUsuariosComponent),
      ...canActivate(() => redirectUnauthorizedToLogin()),
  },
  { 
      path: 'estadisticas',
      loadComponent: () => import('./components/estadisticas/estadisticas.component').then(c => c.EstadisticasComponent),
      ...canActivate(() => redirectUnauthorizedToLogin()),
  },
  { 
      path: 'turnos',
      loadComponent: () => import('./components/turnos/turnos.component').then(c => c.TurnosComponent),
      ...canActivate(() => redirectUnauthorizedToLogin()),
  },
  { 
      path: 'mis-pacientes',
      loadComponent: () => import('./components/mis-pacientes/mis-pacientes.component').then(c => c.MisPacientesComponent),
      ...canActivate(() => redirectUnauthorizedToLogin()),
  },
  { 
      path: '**', redirectTo: 'error'
  }
];