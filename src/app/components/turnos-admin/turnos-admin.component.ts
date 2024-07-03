import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../interfaces/turno';
import Swal from 'sweetalert2';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';
import moment from 'moment';

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
  filtro: string = '';
  turnoService: TurnoService = inject(TurnoService);
  pipe: FormatearFechaPipe = new FormatearFechaPipe();

  constructor() {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.turnoService.obtenerTodosLosTurnos().subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = turnos;
      this.filtrarTurnos('');
    });
  }

  filtrarTurnos(string:string): void {
    this.filtro = this.filtro.toLowerCase();
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtro.toLowerCase()) ||
      turno.pacienteNombre?.toLowerCase().includes(this.filtro.toLowerCase()) ||
      turno.especialistaNombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.ordenarTurnosPorFecha();
  }

  ordenarTurnosPorFecha(): Turno[] {
    return this.turnosFiltrados.sort((a, b) => {
      const fechaA = moment(this.pipe.transform(`${a.fecha} ${a.hora} hs`), 'YYYY-MM-DD h:mm A');
      const fechaB = moment(this.pipe.transform(`${b.fecha} ${b.hora} hs`), 'YYYY-MM-DD h:mm A');
  
      return fechaA.diff(fechaB);
    });
  }

  puedeCancelar(turno: Turno): boolean {
    return turno.estado !== 'Aceptado' && turno.estado !== 'Realizado' && turno.estado !== 'Rechazado' && turno.estado !== 'Finalizado' && turno.estado !== 'Cancelado';
  }

  cancelarTurno(turno: Turno): void {
    Swal.fire({
      title: 'Cancelar turno',
      text: 'Motivo de cancelación',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Cancelar Turno',
      cancelButtonText: 'Mantener Turno',
      showLoaderOnConfirm: true,
      preConfirm: (motivo) => {
        if (!motivo || motivo.trim() === '') {
          Swal.showValidationMessage('El motivo de cancelación es obligatorio');
          return false;
        } else {
          return this.turnoService.actualizarTurno(turno.id, { estado: 'Cancelado', comentario: 'Motivo de la cancelación: '+motivo }).toPromise();
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Turno cancelado',
          icon: 'success'
        });
      }
    });
  }

  buttonAgregarTurno(): void {
    alert('Funcionalidad no implementada');
  }
}