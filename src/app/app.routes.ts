import { Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['bienvenida']);
/* import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrarPacienteComponent } from './components/registrar-paciente/registrar-paciente.component';
import { RegistrarEspecialistaComponent } from './components/registrar-especialista/registrar-especialista.component';
import { AdministrarUsuariosComponent } from './components/administrar-usuarios/administrar-usuarios.component'; */

export const routes: Routes = [
  { 
      path: '', redirectTo: 'home', pathMatch: 'full'
  },
  { 
      path: 'login',
      loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
      ...canActivate(() => redirectLoggedInToHome()),
  },
  { 
      path: 'registrar/especialista',
      loadComponent: () => import('./components/registrar-especialista/registrar-especialista.component').then(c => c.RegistrarEspecialistaComponent),
      //...canActivate(() => redirectLoggedInToHome()),
  },
  { 
      path: 'registrar/paciente',
      loadComponent: () => import('./components/registrar-paciente/registrar-paciente.component').then(c => c.RegistrarPacienteComponent),
      //...canActivate(() => redirectLoggedInToHome()),
  },
  { 
      path: 'bienvenida',
      loadComponent: () => import('./components/bienvenida/bienvenida.component').then(c => c.BienvenidaComponent),
      //...canActivate(() => redirectUnauthorizedToLogin()),
  },
  { 
      path: 'administrar-usuarios',
      loadComponent: () => import('./components/administrar-usuarios/administrar-usuarios.component').then(c => c.AdministrarUsuariosComponent),
      ...canActivate(() => redirectUnauthorizedToLogin()),
  },
  { 
      path: '**', redirectTo: 'error'
  }
];