import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [ RouterLink, RouterOutlet, RouterModule, CommonModule],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})
export class BienvenidaComponent {
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);

  

}
