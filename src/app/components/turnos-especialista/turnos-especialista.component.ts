import { Component, OnInit, inject, Input, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../interfaces/turno';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';
import moment from 'moment';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { FormHistoriaClinicaComponent } from '../form-historia-clinica/form-historia-clinica.component';
import { HistoriaClinica } from '../../interfaces/historia-clinica';
import { Paciente } from '../../models/paciente';
import { HistoriasClinicasComponent } from '../historias-clinicas/historias-clinicas.component';

@Component({
  selector: 'app-turnos-especialista',
  standalone: true,
  imports: [ CommonModule, FormsModule, FormatearFechaPipe, FormHistoriaClinicaComponent, HistoriasClinicasComponent],
  templateUrl: './turnos-especialista.component.html',
  styleUrl: './turnos-especialista.component.css'
})
export class TurnosEspecialistaComponent implements OnInit {

  @Input() pacienteSeleccionado!: Paciente;

  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtro: string = '';
  userService: UserService = inject(UserService);
  turnoService: TurnoService = inject(TurnoService);
  pipe: FormatearFechaPipe = new FormatearFechaPipe();
  historiaClinicaService: HistoriaClinicaService = inject(HistoriaClinicaService);

  historiaClinica: HistoriaClinica | null = null;
  historiasClinicas: HistoriaClinica[] = [];
  historiaClinicaToogle: boolean = false;
  historialPacienteToggle: boolean = false;
  turnoAux: Turno | null = null;

  pacienteId: string = '';

  constructor() {}

  ngOnInit(): void {
    this.cargarTurnos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pacienteSeleccionado'] && this.pacienteSeleccionado) {
      this.cargarTurnos();
      this.historialPacienteToggle = false;
    }
  }

  cargarTurnos(): void {
    const especialistaId = this.userService.personaLogeada.nroDocumento;
    this.turnoService.obtenerTurnosTomadosPorEspecialista(especialistaId).subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = turnos;
      this.filtrarTurnos('');
    });
    if (this.pacienteSeleccionado) {
      this.filtro = this.pacienteSeleccionado.apellido + ' ' + this.pacienteSeleccionado.nombre;
      this.filtrarTurnos(this.filtro);
    }
  }

  filtrarTurnos(string : string): void {
    this.filtro = this.filtro.toLowerCase();
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtro) ||
      turno.pacienteNombre?.toLowerCase().includes(this.filtro)
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
    return turno.estado !== 'Realizado' && turno.estado !== 'Rechazado' && turno.estado !== 'Cancelado' && turno.estado !== 'Finalizado';
  }

  puedeRechazar(turno: Turno): boolean {
    return turno.estado !== 'Aceptado' && turno.estado !== 'Realizado' && turno.estado !== 'Cancelado' && turno.estado !== 'Rechazado' && turno.estado !== 'Finalizado';
  }

  puedeAceptar(turno: Turno): boolean {
    return turno.estado !== 'Realizado' && turno.estado !== 'Cancelado' && turno.estado !== 'Rechazado' && turno.estado !== 'Aceptado' && turno.estado !== 'Finalizado';
  }

  puedeFinalizar(turno: Turno): boolean {
    return turno.estado === 'Aceptado';
  }

  puedeVerResenia(turno: Turno): boolean {
    return turno.reseniaMedico != undefined && turno.reseniaMedico != null && turno.reseniaMedico.length > 0;
  }

  puedeVerComentario(turno: Turno): boolean {
    return turno.comentario != undefined && turno.comentario != null && turno.comentario.length > 0;
  }

  puedeVerHistoriaClinica(turno: Turno): boolean {
    return turno.reseniaMedico != undefined && turno.reseniaMedico != null && turno.reseniaMedico.length > 0;
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

  rechazarTurno(turno: Turno): void {
    Swal.fire({
      title: 'Rechazar turno',
      text: 'Motivo del rechazo',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Rechazar Turno',
      cancelButtonText: 'Mantener Turno',
      showLoaderOnConfirm: true,
      preConfirm: (motivo) => {
        if (!motivo || motivo.trim() === '') {
          Swal.showValidationMessage('El motivo del rechazo es obligatorio');
          return false;
        } else {
          return this.turnoService.actualizarTurno(turno.id, { estado: 'Rechazado', comentario: "Motivo del rechazo: "+motivo }).toPromise();
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Turno Rechazado',
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

  verHistoriaClinica(pacienteId: string): void {
    this.pacienteId = pacienteId;
    this.toggleHistorialPaciente();
  }

  toggleHistorialPaciente(): void {
    this.historialPacienteToggle = !this.historialPacienteToggle;
  }

  aceptarTurno(turno: Turno): void {
    turno.estado = 'Aceptado';
    this.turnoService.actualizarTurno(turno.id, { estado: 'Aceptado' }).subscribe(() => {
      this.cargarTurnos();
    });
  }

  finalizarTurno(turno: Turno): void {
    this.turnoAux = turno;
    this.historiaClinicaToogle = !this.historiaClinicaToogle;
  }

  //OK
  guardarHistoriaClinica(historiaClinica: HistoriaClinica): void {
    this.historiaClinicaService.agregarHistoriaClinica(historiaClinica).subscribe(response => {
      this.historiaClinicaToogle = !this.historiaClinicaToogle;
    });
  }
}