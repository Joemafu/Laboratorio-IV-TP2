import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {

  authService : AuthService = inject(AuthService);
  usuario = this.authService.personaLogeada;



}
