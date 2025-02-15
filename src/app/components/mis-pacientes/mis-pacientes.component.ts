import { Component, OnInit, inject } from '@angular/core';
import { EspecialistaService } from '../../services/especialista.service';
import { Paciente } from '../../models/paciente';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Turno } from '../../interfaces/turno';
import { TurnoService } from '../../services/turno.service';
import { TurnosEspecialistaComponent } from '../turnos-especialista/turnos-especialista.component';
import Swal from 'sweetalert2';
import { PacienteService } from '../../services/paciente.service';
import { TurnosAdminComponent } from '../turnos-admin/turnos-admin.component';

@Component({
  selector: 'app-mis-pacientes',
  standalone: true,
  imports: [ CommonModule, TurnosEspecialistaComponent, TurnosAdminComponent ],
  templateUrl: './mis-pacientes.component.html',
  styleUrl: './mis-pacientes.component.css'
})
export class MisPacientesComponent implements OnInit {

  pacientes: Paciente[] = [];
  userService: UserService = inject(UserService);
  especialistaId: string = this.userService.personaLogeada.nroDocumento;

  turnosPacienteSeleccionado: Turno[] = [];
  pacienteSeleccionado: Paciente | null = null;

  turnos: Turno[] = [];
  selectedPaciente: Paciente | null = null;
  especialistaService: EspecialistaService = inject(EspecialistaService);
  turnoService: TurnoService = inject(TurnoService);

  pacienteService: PacienteService = inject(PacienteService);

  constructor() {}

  ngOnInit(): void {
    do{
      this.especialistaId = this.userService.personaLogeada.nroDocumento;
    }
    while(this.userService.personaLogeada == null || undefined);
    if(this.userService.personaLogeada.rol === 'Admin') {
      this.cargarTodosLosPacientes();  
    } else {
      this.cargarPacientesPorEspecialista();
    }    
  }

  cargarTodosLosPacientes(): void {
    this.pacienteService.getPacientes().subscribe((pacientes: Paciente[]) => {
      this.pacientes = pacientes;
    });
  }

  cargarPacientesPorEspecialista(): void {
    this.especialistaService.getPacientesByEspecialista(this.especialistaId).subscribe((pacientes: Paciente[]) => {
      this.pacientes = pacientes;
    });
  }

  selectPaciente(paciente: Paciente): void {
    this.selectedPaciente = paciente;
    this.turnoService.obtenerTurnosPorPaciente(paciente.nroDocumento).subscribe((turnos: Turno[]) => {
      this.turnos = turnos;
    });
  }

  verResenia(turno: Turno): void {
    Swal.fire({
      title: 'Reseña de la consulta',
      text: turno.reseniaMedico || 'No hay reseña disponible',
      icon: 'info'
    });
  }
}