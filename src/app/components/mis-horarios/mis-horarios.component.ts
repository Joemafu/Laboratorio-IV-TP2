import { Component, OnInit, inject } from '@angular/core';
import { TurnoService } from '../../services/turno.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { Especialidad } from '../../interfaces/especialidad';
import { Turno } from '../../interfaces/turno';
import { Especialista } from '../../models/especialista';
import { UserService } from '../../services/user.service';
import { EspecialistaService } from '../../services/especialista.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-horarios',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './mis-horarios.component.html',
  styleUrl: './mis-horarios.component.css'
})
export class MisHorariosComponent implements OnInit {

  especialidades: Especialidad[] = [];
  especialista: Especialista;
  dias: string[] = [];
  selectedTurnos: { especialidad: string, fecha: string, hora: string }[] = [];
  selectedEspecialidad?: Especialidad;
  activeDay: string = '';
  userService: UserService = inject(UserService);
  especialidadService: EspecialidadService = inject(EspecialidadService);
  turnoService: TurnoService = inject(TurnoService);
  especialistaService: EspecialistaService = inject(EspecialistaService);
  turnos: Turno[] = [];
  turnosExistentes: Turno[] = [];

  constructor() {
    this.especialista = this.userService.personaLogeada;
    this.loadEspecialidades();
    this.generateDias();
    this.initializeSelectedTurnos();
    this.loadTurnosExistentes();
  }

  ngOnInit(): void {
    
  }

  loadEspecialidades(): void {
    this.especialidades = this.especialista.especialidades;
    this.selectedEspecialidad = this.especialidades[0];
  }

  loadTurnosExistentes(): void {
    this.turnoService.obtenerTurnosPorEspecialista(this.especialista.nroDocumento).subscribe(turnos => {
      this.turnosExistentes = turnos;
    });
  }

  selectEspecialidad(especialidad: Especialidad): void {
    this.selectedEspecialidad = especialidad;
  }

  generateDias(): void {
    const start = new Date();
    for (let i = 1; i < 15; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const diaStr = `${day.toLocaleString('default', { weekday: 'long' })} ${day.getDate()}/${day.getMonth() + 1}`;
      if (!this.isSunday(diaStr)) {
        this.dias.push(diaStr);
      }
    }
  }

  initializeSelectedTurnos(): void {
    this.selectedTurnos = [];
    this.turnos = [];
  }  

  getHorasDisponibles(fecha: string): string[] {
    const [weekday] = fecha.split(' ');
    const isSaturday = weekday.toLowerCase() === 'sábado';
    const horas = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'
    ];
    return isSaturday ? horas : [...horas, 
      '14:00', '14:30', '15:00', '15:30', '16:00',
      '16:30', '17:00', '17:30', '18:00', '18:30'];
  }

  isSunday(fecha: string): boolean {
    const [weekday] = fecha.split(' ');
    return weekday.toLowerCase() === 'domingo';
  }

  setActiveDay(fecha: string): void {
    this.activeDay = fecha;
  }

  isTurnoSeleccionado(fecha: string, hora: string): boolean {
    if (!this.selectedEspecialidad) return false;
  
    const formattedFecha = this.formatFecha(fecha);
    const formattedHora = this.formatHora(hora);
  
    return this.selectedTurnos.some(
      t => t.fecha === formattedFecha && t.hora === formattedHora
    );
  }

  toggleTurno(fecha: string, hora: string): void {
    if (!this.selectedEspecialidad) return;
  
    const formattedFecha = this.formatFecha(fecha);
    const formattedHora = this.formatHora(hora);
  
    let turno = {
      especialidad: String(this.selectedEspecialidad),
      fecha: formattedFecha,
      hora: formattedHora
    };
  
    const index = this.selectedTurnos.findIndex(
      t => t.fecha === turno.fecha && t.hora === turno.hora
    );
  
    if (index > -1) {
      this.selectedTurnos.splice(index, 1);
    } else {
      this.selectedTurnos.push(turno);
    }
  }
  
  isTurnoDisponible(fecha: string, hora: string): boolean {
    const formattedFecha = this.formatFecha(fecha);
    const formattedHora = this.formatHora(hora);
  
    const turnoExistente = this.turnosExistentes.some(t => {
      const tFecha = t.fecha;
      const tHora = t.hora;
      return tFecha === formattedFecha && tHora === formattedHora;
    });
  
    return !turnoExistente;
  }
  
  private formatFecha(fecha: string): string {   
    return `${fecha}/${new Date().getFullYear()}`;
  }
  
  private formatHora(hora: string): string {
    return hora.replace(/\s*hs$/, '').trim();
  }

  saveHorarios(): void {

    this.selectedTurnos.forEach(turno => {
      const turnoNuevo: Turno = {
        id: '',
        pacienteId: '',
        pacienteNombre: '',
        especialistaId: this.especialista.nroDocumento,
        especialistaNombre: `${this.especialista.apellido} ${this.especialista.nombre}`,
        especialidad: turno.especialidad,
        fecha: turno.fecha,
        hora: turno.hora,
        estado: 'Libre',
        comentario: '',
        reseniaMedico: '',
        calificacion: '',
        encuesta: ''
      };
      this.turnos.push(turnoNuevo);    
    });

    this.turnoService.agregarTurnos(this.turnos).then(() => {
      this.initializeSelectedTurnos();
    }).catch(error => {
      console.error('Error al guardar horarios: ', error);
    });
  }

  cancelar(): void {
    this.initializeSelectedTurnos();
  }
}