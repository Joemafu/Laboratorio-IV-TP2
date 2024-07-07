import { Component, OnInit, inject } from '@angular/core';
import { Especialista } from '../../models/especialista';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Turno } from '../../interfaces/turno';
import { TurnoService } from '../../services/turno.service';
import { TurnosPacienteComponent } from '../turnos-paciente/turnos-paciente.component';
import { EspecialistaService } from '../../services/especialista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-especialistas',
  standalone: true,
  imports: [ CommonModule, TurnosPacienteComponent ],
  templateUrl: './mis-especialistas.component.html',
  styleUrl: './mis-especialistas.component.css'
})
export class MisEspecialistasComponent implements OnInit{

  especialistas: Especialista[] = [];
  userService: UserService = inject(UserService);
  pacienteId: string = this.userService.personaLogeada.nroDocumento;
  especialistaService: EspecialistaService = inject(EspecialistaService);

  turnosEspecialistaSeleccionado: Turno[] = [];
  especialistaSeleccionado: Especialista | null = null;

  turnos: Turno[] = [];
  selectedEspecialista: Especialista | null = null;
  turnoService: TurnoService = inject(TurnoService);

  constructor() {}

  ngOnInit(): void {
    this.cargarEspecialistas();
  }

  cargarEspecialistas(): void {
    this.especialistaService.getEspecialistasByPaciente(this.pacienteId).subscribe((especialistas: Especialista[]) => {
      this.especialistas = especialistas;
    });
  }

  selectEspecialista(especialista: Especialista): void {
    this.selectedEspecialista = especialista;
    this.turnoService.obtenerTurnosPorEspecialista(especialista.nroDocumento).subscribe((turnos: Turno[]) => {
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
