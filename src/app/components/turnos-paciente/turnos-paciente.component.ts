import { Component, OnInit, inject, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../interfaces/turno';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';
import moment from 'moment';
import { Especialista } from '../../models/especialista';
import { HistoriasClinicasComponent } from '../historias-clinicas/historias-clinicas.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [ CommonModule, FormsModule, HistoriasClinicasComponent],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.css'
})
export class TurnosPacienteComponent implements OnInit{

  @Input() especialistaSeleccionado!: Especialista;

  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtro: string = '';
  userService: UserService = inject(UserService);
  turnoService: TurnoService = inject(TurnoService);
  pipe: FormatearFechaPipe = new FormatearFechaPipe();
  historialEspecialistaToggle: boolean = false;
  pacienteId: string = '';
  especialistaId: string = '';

  constructor() {}

  ngOnInit(): void {
    this.cargarTurnos();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['especialistaSeleccionado'] && this.especialistaSeleccionado) {
      this.cargarTurnos();
      this.historialEspecialistaToggle = false;
    }
  }

  cargarTurnos(): void {
    const pacienteId = this. userService.personaLogeada.nroDocumento;
    this.turnoService.obtenerTurnosPorPaciente(pacienteId).subscribe(turnos => {
      this.turnos = turnos;
      this.filtrarTurnos('');
    });
    if (this.especialistaSeleccionado) {
      this.filtro = this.especialistaSeleccionado.apellido + ' ' + this.especialistaSeleccionado.nombre;
      this.filtrarTurnos(this.filtro);
    }
  }

  filtrarTurnos(filtro : string): void {
    this.filtro = this.filtro.toLowerCase();
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtro) ||
      turno.especialistaNombre.toLowerCase().includes(this.filtro)
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
    return turno.estado !== 'Realizado' && turno.estado !== 'Cancelado' && turno.estado !== 'Rechazado' && turno.estado !== 'Finalizado';
  }

  puedeVerResenia(turno: Turno): boolean {
    return turno.reseniaMedico != undefined && turno.reseniaMedico != null && turno.reseniaMedico.length > 0;
  }
  
  puedeVerComentario(turno: Turno): boolean {
    return turno.comentario != undefined && turno.comentario != null && turno.comentario.length > 0;
  }

  puedeCompletarEncuesta(turno: Turno): boolean {
    return turno.estado === 'Finalizado' && turno.reseniaMedico != undefined && turno.reseniaMedico != null && turno.reseniaMedico.length > 0 && !turno.encuesta;
  }

  puedeCalificar(turno: Turno): boolean {
    return turno.estado === 'Finalizado' && !turno.calificacion;
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

  verResenia(turno: Turno): void {
    Swal.fire({
      title: 'Reseña del especialista:',
      text: turno.reseniaMedico,
      icon: 'info'
    });
  }

  verComentario(turno: Turno): void {
    Swal.fire({
      title: 'Comentario:',
      text: turno.comentario,
      icon: 'info'
    });
  }

  completarEncuesta(turno: Turno): void {
    Swal.fire({
      title: 'Completar encuesta',
      text: 'Recomendaría el servicio a otras personas?',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Completar encuesta',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (encuesta) => {
        if (!encuesta || encuesta.trim() === '') {
          Swal.showValidationMessage('Por favor indique "si" o "no", o deje una sugerencia');
          return false;
        } else {
          return this.turnoService.actualizarTurno(turno.id, { encuesta }).toPromise();
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Encuesta completada',
          icon: 'success'
        });
    }});
  }

  calificarAtencion(turno: Turno): void {
    Swal.fire({
      title: 'Calificar atención',
      text: 'Calificación (1 a 5)',
      input: 'number',
      inputAttributes: {
        min: '1',
        max: '5'
      },
      showCancelButton: true,
      confirmButtonText: 'Calificar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (calificacion) => {
        if (!calificacion || calificacion < 1 || calificacion > 5) {
          Swal.showValidationMessage('La calificación debe ser un número entre 1 y 5');
          return false;
        } else {
          return this.turnoService.actualizarTurno(turno.id, { calificacion }).toPromise();
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Calificación realizada',
          icon: 'success'
        });
      }
    });
  }

  verHistoriaClinica(especialistaId: string): void {
    this.especialistaId = especialistaId;
    this.toggleHistorialEspecialista();
  }

  toggleHistorialEspecialista(): void {
    this.historialEspecialistaToggle = !this.historialEspecialistaToggle;
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  descargarHistorialTurnosExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.turnosFiltrados.map(turno => ({
      Especialidad: turno.especialidad,
      Paciente: turno.pacienteNombre,
      "DNI Paciente": turno.pacienteId,
      Fecha: turno.fecha,
      Hora: turno.hora,
      Estado: turno.estado,
      Calificacion: turno.calificacion,
      Comentario: turno.comentario,
      Encuesta: turno.encuesta,
      Especialista: turno.especialistaNombre,
      "Reseña/Diagnóstico": turno.reseniaMedico,      
    })));

    const workbook: XLSX.WorkBook = { Sheets: { 'Historial de Turnos': worksheet }, SheetNames: ['Historial de Turnos'] };
    XLSX.writeFile(workbook, `HistorialTurnos_${this.pacienteId}.xlsx`);
  }
}