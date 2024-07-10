import { Component, Input, OnInit, inject, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { Turno } from '../../interfaces/turno';
import Swal from 'sweetalert2';
import { FormatearFechaConsignaPipe } from '../../pipes/formatear-fecha-consigna.pipe';
import { Paciente } from '../../models/paciente';
import moment from 'moment';
import { HistoriasClinicasComponent } from '../historias-clinicas/historias-clinicas.component';
import { UserService } from '../../services/user.service';
import * as XLSX from 'xlsx';
import { HistoriaClinica } from '../../interfaces/historia-clinica';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';

@Component({
  selector: 'app-turnos-admin',
  standalone: true,
  imports: [ CommonModule, FormsModule, HistoriasClinicasComponent ],
  templateUrl: './turnos-admin.component.html',
  styleUrl: './turnos-admin.component.css'
})
export class TurnosAdminComponent implements OnInit {

  @Input() pacienteSeleccionado!: Paciente;

  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  filtro: string = '';
  turnoService: TurnoService = inject(TurnoService);
  pipe: FormatearFechaConsignaPipe = new FormatearFechaConsignaPipe();

  historiasClinicas: HistoriaClinica[] = [];
  historiasClinicasFiltradas: HistoriaClinica[] = [];
  mostrarHistoriasClinicas: boolean = false;
  historiaClinicaService: HistoriaClinicaService = inject(HistoriaClinicaService);

  historialPacienteToggle: boolean = false;
  userService: UserService = inject(UserService);
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
    this.turnoService.obtenerTodosLosTurnos().subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = turnos;
      this.filtrarTurnos('');
    });
    if (this.pacienteSeleccionado) {
      this.filtro = this.pacienteSeleccionado.apellido + ' ' + this.pacienteSeleccionado.nombre;
      this.filtrarTurnos(this.filtro);
    }
    this.cargarHistoriasClinicas();
  }

  cargarHistoriasClinicas(): void {
    this.historiaClinicaService.obtenerTodasLasHistoriasClinicas().subscribe(historiasClinicas => {
      this.historiasClinicas = historiasClinicas;
    });
  }

  filtrarTurnos(filtro : string): void {
    this.filtro = this.filtro.toLowerCase();
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.especialidad.toLowerCase().includes(this.filtro) ||
      turno.pacienteNombre?.toLowerCase().includes(this.filtro) ||
      turno.comentario?.toLowerCase().includes(this.filtro) || 
      turno.encuesta?.toLowerCase().includes(this.filtro) || 
      turno.calificacion?.toString().includes(this.filtro)
    );
    if(!this.pacienteSeleccionado) {
      this.buscarEnHistoriasClinicas(this.filtro);
    }
    this.ordenarTurnosPorFecha();
  }

  buscarEnHistoriasClinicas(filtro: string): void {
    this.historiasClinicasFiltradas = [];
    if(this.filtro === '') {
      this.mostrarHistoriasClinicas = false;
      return;
    }
    this.turnos.forEach(turno => {
      if(turno.reseniaMedico?.toLowerCase().includes(this.filtro))
      {
        this.turnosFiltrados.push(turno);
        this.historiasClinicas.forEach(historiaClinica => {
          if(historiaClinica.turnoId === turno.id && !this.historiasClinicasFiltradas.includes(historiaClinica))
          {
            this.historiasClinicasFiltradas.push(historiaClinica);
          }
        });
        this.mostrarHistoriasClinicas = true;
      }
    });
    this.historiasClinicas.forEach(historiaClinica => {
      if (
        historiaClinica.altura.toString().includes(this.filtro) ||
        historiaClinica.peso.toString().includes(this.filtro) ||
        historiaClinica.temperatura.toString().includes(this.filtro) ||
        historiaClinica.presion.toString().includes(this.filtro) ||
        historiaClinica.datoDinamicoUno?.clave.toLowerCase().includes(this.filtro) ||
        historiaClinica.datoDinamicoUno?.valor.toLowerCase().includes(this.filtro) ||
        historiaClinica.datoDinamicoDos?.clave.toLowerCase().includes(this.filtro) ||
        historiaClinica.datoDinamicoDos?.valor.toLowerCase().includes(this.filtro) ||
        historiaClinica.datoDinamicoTres?.clave.toLowerCase().includes(this.filtro) ||
        historiaClinica.datoDinamicoTres?.valor.toLowerCase().includes(this.filtro)
      ) {
        this.turnos.forEach(turno => {
          historiaClinica.turnoId === turno.id && !this.turnosFiltrados.includes(turno) ? this.turnosFiltrados.push(turno) : null;          
        });
        if(!this.historiasClinicasFiltradas.includes(historiaClinica))
        {
          this.historiasClinicasFiltradas.push(historiaClinica);
        }
        this.mostrarHistoriasClinicas = true;
      }
      if(this.historiasClinicasFiltradas.length === 0) {
        this.mostrarHistoriasClinicas = false;
      }
    });
  }

  ordenarTurnosPorFecha(): Turno[] {
    return this.turnosFiltrados.sort((a, b) => {
      const fechaA = a.fecha.split(' ').slice(1).join(' ');
      const fechaHoraA = moment(`${fechaA} ${a.hora}`, 'D/M/YYYY HH:mm');
      const fechaB = b.fecha.split(' ').slice(1).join(' ');
      const fechaHoraB = moment(`${fechaB} ${b.hora}`, 'D/M/YYYY HH:mm');
      return fechaHoraA.diff(fechaHoraB);
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

  verHistoriaClinica(pacienteId: string): void {
    this.pacienteId = pacienteId;
    this.toggleHistorialPaciente();
  }

  toggleHistorialPaciente(): void {
    this.historialPacienteToggle = !this.historialPacienteToggle;
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
    XLSX.writeFile(workbook, `HistorialTurnos_${this.pacienteSeleccionado.nroDocumento}.xlsx`);
  }

  descargarDatosPacienteExcel(): void {
    if (!this.pacienteSeleccionado) {
      Swal.fire('Error', 'No hay paciente seleccionado', 'error');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{
      Nombre: this.pacienteSeleccionado.nombre,
      Apellido: this.pacienteSeleccionado.apellido,
      DNI: this.pacienteSeleccionado.nroDocumento,
      "Fecha de Nacimiento": this.pacienteSeleccionado.fechaNac,
      Email: this.pacienteSeleccionado.mail,
      "Obra Social": this.pacienteSeleccionado.obraSocial,
    }]);

    const workbook: XLSX.WorkBook = { Sheets: { 'Datos del Paciente': worksheet }, SheetNames: ['Datos del Paciente'] };
    XLSX.writeFile(workbook, `DatosPaciente_${this.pacienteSeleccionado.nombre}_${this.pacienteSeleccionado.apellido}_${this.pacienteSeleccionado.nroDocumento}.xlsx`);
  }
}