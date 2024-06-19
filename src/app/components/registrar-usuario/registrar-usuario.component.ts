import { Component } from '@angular/core';
import { RegistrarEspecialistaComponent } from '../registrar-especialista/registrar-especialista.component';
import { RegistrarPacienteComponent } from '../registrar-paciente/registrar-paciente.component';
import { RegistrarAdminComponent } from '../registrar-admin/registrar-admin.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-usuario',
  standalone: true,
  imports: [ CommonModule, RegistrarEspecialistaComponent, RegistrarPacienteComponent, RegistrarAdminComponent ],
  templateUrl: './registrar-usuario.component.html',
  styleUrl: './registrar-usuario.component.css'
})
export class RegistrarUsuarioComponent {

  mostrarFormE= false;
  mostrarFormP= false;
  mostrarFormA= false;
  esAdmin = false;
  

  mostrarFormEspecialista()
  {
    this.mostrarFormE = true;
    this.mostrarFormP = false;
    this.mostrarFormA = false;
  }

  mostrarFormPaciente()
  {
    this.mostrarFormP = true;
    this.mostrarFormE = false;
    this.mostrarFormA = false;
  }

  mostrarFormAdmin()
  {
    this.mostrarFormA = true;
    this.mostrarFormP = false;
    this.mostrarFormE = false;
  }

}
