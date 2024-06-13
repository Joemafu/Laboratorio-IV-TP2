import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Usuario } from '../../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../interfaces/paciente';
import { Especialista } from '../../interfaces/especialista';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.css'
})
export class AdministrarUsuariosComponent implements OnInit {

  pacientes: Paciente[] = [];
  especialistas: Especialista[] = [];
  pacienteService: UserService = inject(UserService);
  especialistaService: UserService = inject(UserService);
  userService: UserService = inject(UserService);
  pacienteSubscription: Subscription = new Subscription();
  especialistaSubscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.pacienteSubscription = this.pacienteService.paciente$.subscribe ((paciente) => {
      if (paciente) {
        this.pacientes = paciente;
      }
    });

    this.especialistaSubscription = this.especialistaService.especialista$.subscribe ((especialista) => {
      if (especialista) {
        this.especialistas = especialista;
      }
    });

    /* console.log(this.pacientes);
    console.log(this.especialistas);

    this.pacienteService.getPacientes().subscribe(data => {
      this.pacientes = data;
      console.log(this.pacientes);
    });
    this.especialistaService.getEspecialistas().subscribe(data => {
      this.especialistas = data;
      console.log(this.especialistas);
    }); */
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
