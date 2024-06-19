import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../models/usuario';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../models/paciente';
import { Especialista } from '../../models/especialista';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.css'
})
export class AdministrarUsuariosComponent implements OnInit {

  userService: UserService = inject(UserService);
  especialistas$!: Observable<Especialista[]>;
  pacientes$!: Observable<Paciente[]>;

  constructor() {

  }

  ngOnInit(): void {
    this.especialistas$ = this.userService.getEspecialistas();
    this.pacientes$ = this.userService.getPacientes();
  }

  activarUsuario(usuario: Usuario) {
    if (usuario.rol === 'paciente') {
      this.userService.activarPaciente(usuario);
    } else if (usuario.rol === 'especialista') {
      this.userService.activarEspecialista(usuario);
    }
  }

  desactivarUsuario(usuario: Usuario) {
    if (usuario.rol === 'paciente') {
      this.userService.desactivarPaciente(usuario);
    } else if (usuario.rol === 'especialista') {
      this.userService.desactivarEspecialista(usuario);
    }
  }
}
