import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TurnosPacienteComponent } from '../turnos-paciente/turnos-paciente.component';
import { TurnosEspecialistaComponent } from '../turnos-especialista/turnos-especialista.component';
import { TurnosAdminComponent } from '../turnos-admin/turnos-admin.component';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { SolicitarTurnoComponent } from '../solicitar-turno/solicitar-turno.component';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, TurnosPacienteComponent, TurnosEspecialistaComponent, TurnosAdminComponent, MatIconModule, MatButtonModule, MatMenuModule, SolicitarTurnoComponent],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent implements OnInit{

  agregarTurno: boolean = false;
  rol?: string;
  userService: UserService = inject(UserService);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    //this.rol = this.authService.personaLogeada?.rol;
    this.rol = this.userService.personaLogeada?.rol;
    if (!this.rol) {
      this.router.navigate(['/login']);
    }
  }

  buttonAgregarTurno() {
    this.agregarTurno = !this.agregarTurno;
  }
}

/* BORRADOR - REVISAR */