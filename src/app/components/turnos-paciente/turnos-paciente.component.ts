import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../interfaces/turno';


import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit{
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtroEspecialidad: string = '';
  filtroEspecialista: string = '';

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    const pacienteId = 'paciente-id'; // Reemplazar con el ID del paciente autenticado
    this.turnoService.obtenerTurnosPorPaciente(pacienteId).subscribe(turnos => {
      this.turnos = turnos;
      this.obtenerNombresEspecialistas();
    });
  }

  //new
  obtenerNombresEspecialistas(): void {
    const requests = this.turnos.map(turno =>
      this.turnoService.obtenerNombreEspecialista(turno.especialistaId)
    );

    forkJoin(requests).subscribe(nombres => {
      this.turnos.forEach((turno, index) => {
        turno.especialistaId = nombres[index];
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
    return turno.estado !== 'Realizado';
  }

  puedeVerResenia(turno: Turno): boolean {
    return turno.comentario != undefined && turno.comentario != null && turno.comentario.length > 0;
  }

  puedeCompletarEncuesta(turno: Turno): boolean {
    return turno.estado === 'Realizado' && turno.comentario != undefined && turno.comentario != null && turno.comentario.length > 0;
  }

  puedeCalificar(turno: Turno): boolean {
    return turno.estado === 'Realizado' && !turno.calificacion;
  }

  cancelarTurno(turno: Turno): void {
    turno.estado = 'Cancelado';
    this.turnoService.actualizarTurno(turno.id, { estado: 'Cancelado', comentario: 'Cancelado por el paciente' }).subscribe(() => {
      this.cargarTurnos();
    });
  }

  verResenia(turno: Turno): void {
    alert(turno.comentario);
  }

  completarEncuesta(turno: Turno): void {
    const encuesta = prompt('Completar encuesta:');
    if (encuesta) {
      turno.encuesta = encuesta;
      this.turnoService.actualizarTurno(turno.id, { encuesta }).subscribe(() => {
        this.cargarTurnos();
      });
    }
  }

  calificarAtencion(turno: Turno): void {
    const calificacion = prompt('Calificar atención:');
    if (calificacion) {
      turno.calificacion = calificacion;
      this.turnoService.actualizarTurno(turno.id, { calificacion }).subscribe(() => {
        this.cargarTurnos();
      });
    }
  }
}

/* BORRADOR - REVISAR */