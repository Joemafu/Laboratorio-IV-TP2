import { Component, OnInit, inject } from '@angular/core';
import { EspecialistaService } from '../../services/especialista.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { TurnoService } from '../../services/turno.service';
import { Especialista } from '../../models/especialista';
import { Especialidad } from '../../interfaces/especialidad';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit{

  especialidades: Especialidad[] = [];
  especialistas: Especialista[] = [];
  horariosDisponibles: { fecha: string, hora: string }[] = [];
  fechaSelected: string = '';
  horaSelected: string = '';
  seleccionadoEspecialista: Especialista | null = null;
  seleccionadaEspecialidad: Especialidad | null = null;
  especialistaService: EspecialistaService = inject(EspecialistaService);
  especialidadService: EspecialidadService = inject(EspecialidadService);
  turnoService: TurnoService = inject(TurnoService);
  userService: UserService = inject(UserService);

  constructor() {}

  //OK
  ngOnInit() {
    this.loadEspecialistas(); 
  }

  //OK
  loadEspecialidades(especialista: Especialista) {
    this.especialidades = especialista.especialidades;
  }

  //OK
  loadEspecialistas() {
    this.especialistaService.getEspecialistas().subscribe(data => {
      this.especialistas = data;
    });
  }

  //OK
  onEspecialistaSelect(especialista: Especialista) {
    this.seleccionadoEspecialista = especialista;
    this.loadEspecialidades(especialista);
  }

  //OK
  onEspecialidadSelect(especialidad: Especialidad) {
    this.seleccionadaEspecialidad = especialidad;
    this.loadHorariosDisponibles(this.seleccionadoEspecialista!.nroDocumento, String(this.seleccionadaEspecialidad));
  }

  //OK
  loadHorariosDisponibles(especialistaId: string, especialidadId: string) {
    this.turnoService.obtenerTurnosEspecialistaEspecialidad(especialistaId, especialidadId).subscribe(data => {
      this.horariosDisponibles = data;
    });
  }

  onFechaSelect(fecha: string, hora: string) {
    this.fechaSelected = fecha;
    this.horaSelected = hora;
  }

  //OK
  deseleccionarEspecialista()
  {
    this.seleccionadoEspecialista = null;
    this.deseleccionarEspecialidad();
  }  
  
  //OK
  deseleccionarEspecialidad()
  {
    this.seleccionadaEspecialidad = null;
  }

  onSubmit() {
      this.turnoService.asignarTurnoAPaciente(
        this.fechaSelected, 
        this.horaSelected, 
        this.seleccionadoEspecialista!.nroDocumento, 
        String(this.seleccionadaEspecialidad),
        this.userService.personaLogeada.nroDocumento, 
        this.userService.personaLogeada.apellido+" "+this.userService.personaLogeada.nombre
      ).subscribe(() => {
    });
  }
}

/* <!-- BORRADOR - REVISAR --> */