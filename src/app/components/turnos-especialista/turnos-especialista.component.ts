import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../interfaces/turno';

//new
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent implements OnInit {

  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtroEspecialidad: string = '';
  filtroPaciente: string = '';

  constructor(private turnoService: TurnoService) {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    const especialistaId = 'especialista-id'; // Reemplazar con el ID del especialista autenticado
    this.turnoService.obtenerTurnosPorEspecialista(especialistaId).subscribe(turnos => {
      this.turnos = turnos;
      this.obtenerNombresPacientes();
    });
  }

  obtenerNombresPacientes(): void {
    const requests = this.turnos.map(turno =>
      this.turnoService.obtenerNombrePaciente(turno.pacienteId!)
    );

    forkJoin(requests).subscribe(nombres => {
      this.turnos.forEach((turno, index) => {
        turno.pacienteId = nombres[index];
      });
      this.filtrarTurnos();
    });
  }

  filtrarTurnos(): void {
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase()) &&
      turno.pacienteId?.toLowerCase().includes(this.filtroPaciente.toLowerCase())
    );
  }

  puedeCancelar(turno: Turno): boolean {
    return turno.estado !== 'Realizado' && turno.estado !== 'Rechazado';
  }

  puedeRechazar(turno: Turno): boolean {
    return turno.estado !== 'Aceptado' && turno.estado !== 'Realizado' && turno.estado !== 'Cancelado';
  }

  puedeAceptar(turno: Turno): boolean {
    return turno.estado !== 'Realizado' && turno.estado !== 'Cancelado' && turno.estado !== 'Rechazado';
  }

  puedeFinalizar(turno: Turno): boolean {
    return turno.estado === 'Aceptado';
  }

  cancelarTurno(turno: Turno): void {
    turno.estado = 'Cancelado';
    this.turnoService.actualizarTurno(turno.id, { estado: 'Cancelado', comentario: 'Cancelado por el especialista' }).subscribe(() => {
      this.cargarTurnos();
    });
  }

  rechazarTurno(turno: Turno): void {
    turno.estado = 'Rechazado';
    this.turnoService.actualizarTurno(turno.id, { estado: 'Rechazado', comentario: 'Rechazado por el especialista' }).subscribe(() => {
      this.cargarTurnos();
    });
  }

  aceptarTurno(turno: Turno): void {
    turno.estado = 'Aceptado';
    this.turnoService.actualizarTurno(turno.id, { estado: 'Aceptado' }).subscribe(() => {
      this.cargarTurnos();
    });
  }

  finalizarTurno(turno: Turno): void {
    const comentario = prompt('Reseña/Diagnóstico:');
    if (comentario) {
      turno.estado = 'Realizado';
      turno.comentario = comentario;
      this.turnoService.actualizarTurno(turno.id, { estado: 'Realizado', comentario }).subscribe(() => {
        this.cargarTurnos();
      });
    }
  }
}

/* BORRADOR - REVISAR */