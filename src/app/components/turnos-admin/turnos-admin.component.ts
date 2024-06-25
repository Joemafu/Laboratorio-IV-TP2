import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../interfaces/turno';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-turnos-admin',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './turnos-admin.component.html',
  styleUrl: './turnos-admin.component.css'
})
export class TurnosAdminComponent implements OnInit {

  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.turnoService.obtenerTodosLosTurnos().subscribe(turnos => {
      this.turnos = turnos;
      this.obtenerNombresEspecialistasYPacientes();
    });
  }

  obtenerNombresEspecialistasYPacientes(): void {
    const especialistaRequests = this.turnos.map(turno =>
      this.turnoService.obtenerNombreEspecialista(turno.especialistaId)
    );

    const pacienteRequests = this.turnos.map(turno =>
      this.turnoService.obtenerNombrePaciente(turno.pacienteId!)
    );

    forkJoin([...especialistaRequests, ...pacienteRequests]).subscribe(nombres => {
      const mitad = nombres.length / 2;
      this.turnos.forEach((turno, index) => {
        turno.especialistaId = nombres[index];
        turno.pacienteId = nombres[index + mitad];
      });
      this.filtrarTurnos();
    });
  }

  filtrarTurnos(): void {
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase()) &&
      turno.especialistaId.toLowerCase().includes(this.filtroEspecialista.toLowerCase())
    );
  }

  puedeCancelar(turno: Turno): boolean {
    return turno.estado !== 'Aceptado' && turno.estado !== 'Realizado' && turno.estado !== 'Rechazado';
  }

  cancelarTurno(turno: Turno): void {
    turno.estado = 'Cancelado';
    this.turnoService.actualizarTurno(turno.id, { estado: 'Cancelado', comentario: 'Cancelado por el administrador' }).subscribe(() => {
      this.cargarTurnos();
    });
  }

  buttonAgregarTurno(): void {
    alert('Funcionalidad no implementada');
  }
}

/* BORRADOR - REVISAR */