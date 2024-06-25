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
  selectedTurnos: { especialidad: string, dia: string, hora: string }[] = [];
  selectedEspecialidad?: Especialidad;
  activeDay: string = '';
  userService: UserService = inject(UserService);
  especialidadService: EspecialidadService = inject(EspecialidadService);
  turnoService: TurnoService = inject(TurnoService);
  especialistaService: EspecialistaService = inject(EspecialistaService);
  turnos: Turno[] = [];

  constructor() {
    this.especialista = this.userService.personaLogeada;
    this.loadEspecialidades();
    this.generateDias();
    this.initializeSelectedTurnos();
  }

  ngOnInit(): void {
    
  }

  loadEspecialidades(): void {
    this.especialidades = this.especialista.especialidades;
    console.log("especialidades: ");
    console.log("typeof "+ typeof this.especialidades[0]);
    console.log(this.especialista.especialidades[0]);
    this.selectedEspecialidad = this.especialidades[0];
    console.log(this.selectedEspecialidad);
  }

  selectEspecialidad(especialidad: Especialidad): void {
    this.selectedEspecialidad = especialidad;
    console.log("selectedEspecialidad: ");
    console.log(this.selectedEspecialidad);
    console.log("typeof "+ typeof this.selectedEspecialidad);
  }

  generateDias(): void {
    const start = new Date();
    for (let i = 0; i < 14; i++) {
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
  }  

  getHorasDisponibles(dia: string): string[] {
    const [weekday] = dia.split(' ');
    const isSaturday = weekday.toLowerCase() === 'sábado';
    const horas = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'
    ];
    return isSaturday ? horas : [...horas, 
      '14:00', '14:30', '15:00', '15:30', '16:00',
      '16:30', '17:00', '17:30', '18:00', '18:30'];
  }

  isSunday(dia: string): boolean {
    const [weekday] = dia.split(' ');
    return weekday.toLowerCase() === 'domingo';
  }

  setActiveDay(dia: string): void {
    this.activeDay = dia;
    console.log(this.activeDay);
  }

  isTurnoSeleccionado(dia: string, hora: string): boolean {
    if (!this.selectedEspecialidad) return false;
  
    const formattedDia = `${dia.split(' ')[0]} ${dia.split(' ')[1]}`;
    const formattedHora = `${hora} hs`;
  
    return this.selectedTurnos.some(
      t => t.especialidad === this.selectedEspecialidad?.especialidad && t.dia === formattedDia && t.hora === formattedHora
    );
  }

  toggleTurno(dia: string, hora: string): void {
    if (!this.selectedEspecialidad) return;
  
    console.log("toggleTurno:");
  
    const formattedDia = `${dia.split(' ')[0]} ${dia.split(' ')[1]}`;
    const formattedHora = `${hora} hs`;
  
    console.log('Formatted Día:', formattedDia);
    console.log('Formatted Hora:', formattedHora);
  
    let turno = {
      especialidad: String(this.selectedEspecialidad),
      dia: formattedDia,
      hora: formattedHora
    };
  
    console.log('Turno creado:', turno);
  
    const index = this.selectedTurnos.findIndex(
      t => t.especialidad === turno.especialidad && t.dia === turno.dia && t.hora === turno.hora
    );
  
    console.log('Índice encontrado:', index);
  
    if (index > -1) {
      console.log('Turno encontrado, eliminando...');
      this.selectedTurnos.splice(index, 1);  
    } else {
      console.log('Turno no encontrado, agregando...');
      this.selectedTurnos.push(turno);
    }
  
    console.log('Selected Turnos actualizados:', this.selectedTurnos);
  }
  

  isTurnoDisponible(dia: string, hora: string): boolean {
    if (!this.selectedEspecialidad) return false;

    const formattedDia = `${dia.split(' ')[0]} ${dia.split(' ')[1]}`;
    const formattedHora = `${hora} hs`;
  
    return !this.selectedTurnos.some(
      t => t.especialidad === String(this.selectedEspecialidad) && t.dia === formattedDia && t.hora === formattedHora
    );
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
        fecha: turno.dia,
        hora: turno.hora,
        estado: 'Libre'
        
      };
      console.log('Turno creado:');
      console.log('ID:', turnoNuevo.id);
      console.log('Paciente ID:', turnoNuevo.pacienteId);
      console.log('Paciente Nombre:', turnoNuevo.pacienteNombre);
      console.log('Especialista ID:', turnoNuevo.especialistaId);
      console.log('Especialista Nombre:', turnoNuevo.especialistaNombre);
      console.log('Especialidad:', turnoNuevo.especialidad);
      console.log('Fecha:', turnoNuevo.fecha+'/24');
      console.log('Hora:', turnoNuevo.hora);
      console.log('Estado:', turnoNuevo.estado);
      console.log('------------------------');
      this.turnos.push(turnoNuevo);    
      console.log('pusheado a this.turnos.');
      console.log('------------------------');
    });
    console.log('Turnos finalizados:');
    console.log(this.turnos);

    console.log("esto es lo que hay del especialista: ");
    console.log(this.especialista);

    this.turnoService.agregarTurnos(this.turnos).then(() => {
      console.log('Horarios guardados exitosamente');
    }).catch(error => {
      console.error('Error al guardar horarios: ', error);
    });
  }

  cancelar(): void {
    this.initializeSelectedTurnos();
  }
}

/* BORRADOR - REVISAR */