import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../models/paciente';
import { Especialista } from '../../models/especialista';
import { Subscription } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [ CommonModule, MatSlideToggleModule ],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.css'
})
export class AdministrarUsuariosComponent implements OnInit {

  protected pacientes: Paciente[] = [];
  protected especialistas: Especialista[] = [];
  private userService: UserService = inject(UserService);
  private pacienteSubscription: Subscription = new Subscription();
  private especialistaSubscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.especialistaSubscription = this.userService.especialistas$.subscribe((especialistas) => {
      if (especialistas) {
        this.especialistas = especialistas;
      }
      else {
        this.especialistas = [];
      }
    });
    this.pacienteSubscription = this.userService.pacientes$.subscribe((pacientes) => {
      if (pacientes) {
        this.pacientes = pacientes;
      }
      else {
        this.pacientes = [];
      }
    });
  }  

  ngOnDestroy(): void {
    this.pacienteSubscription.unsubscribe();
    this.especialistaSubscription.unsubscribe();
  }

  toggleUsuarioActivo(usuario: Paciente | Especialista, activo: boolean) {
    const collectionPath = usuario.rol === 'Paciente' ? this.userService.PATHUNO : this.userService.PATHDOS;
    this.userService.actualizarEstadoUsuario(collectionPath, usuario.id, activo).then(() => {
      usuario.activo = activo;
    }).catch(error => {
      console.error('Error actualizando estado: ', error);
    });
  }
}
