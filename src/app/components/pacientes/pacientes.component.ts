import { Component, OnInit, inject } from '@angular/core';
import { EspecialistaService } from '../../services/especialista.service';
import { Paciente } from '../../models/paciente';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {

  pacientes: Paciente[] = [];
  userService: UserService = inject(UserService);
  especialistaId: string = this.userService.personaLogeada.nroDocumento;

  constructor(private especialistaService: EspecialistaService) {}

  ngOnInit(): void {
    console.log("EspecialistaId: ", this.especialistaId);
    this.especialistaService.getPacientesByEspecialista(this.especialistaId).subscribe((pacientes: Paciente[]) => {
      this.pacientes = pacientes;
      console.log("PacientesA: ", pacientes);
      console.log("PacientesB: ", this.pacientes);
    });
  }
}
