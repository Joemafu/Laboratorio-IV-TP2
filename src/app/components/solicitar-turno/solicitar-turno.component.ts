import { Component, OnInit, inject } from '@angular/core';
import { EspecialistaService } from '../../services/especialista.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { PacienteService } from '../../services/paciente.service';
import { TurnoService } from '../../services/turno.service';
import { Especialista } from '../../models/especialista';
import { Especialidad } from '../../interfaces/especialidad';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';
import Swal from 'sweetalert2';
import { Paciente } from '../../models/paciente';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [ CommonModule, FormatearFechaPipe ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit{

  especialidades: Especialidad[] = [];
  especialistas: Especialista[] = [];
  pacientes: Paciente[] = [];
  horariosDisponibles: { fecha: string, hora: string }[] = [];
  fechaSelected: string = '';
  horaSelected: string = '';
  seleccionadoEspecialista: Especialista | null = null;
  seleccionadaEspecialidad: Especialidad | null = null;
  seleccionadoPaciente: Paciente | null = null;
  especialistaService: EspecialistaService = inject(EspecialistaService);
  especialidadService: EspecialidadService = inject(EspecialidadService);
  turnoService: TurnoService = inject(TurnoService);
  userService: UserService = inject(UserService);
  pacienteService: PacienteService = inject(PacienteService);

  constructor() {}

  ngOnInit() {
    this.loadEspecialistas();
    this.loadPacientes();
  }

  loadEspecialidades(especialista: Especialista) {
    this.especialidades = especialista.especialidades;
  }

  loadEspecialistas() {
    this.especialistaService.getEspecialistas().subscribe(data => {
      this.especialistas = data;
    });
  }

  loadPacientes() {
    this.pacienteService.getPacientes().subscribe(data => {
      this.pacientes = data;
    });
  }

  onEspecialistaSelect(especialista: Especialista) {
    this.seleccionadoEspecialista = especialista;
    this.loadEspecialidades(especialista);
    if(this.userService.personaLogeada.rol == "Paciente")
    {
      this.seleccionadoPaciente = this.userService.personaLogeada as Paciente;
    }
  }

  onPacienteSelect(paciente: Paciente) {
    this.seleccionadoPaciente = paciente;
  }

  onEspecialidadSelect(especialidad: Especialidad) {
    this.seleccionadaEspecialidad = especialidad;
    this.loadHorariosDisponibles(this.seleccionadoEspecialista!.nroDocumento, String(this.seleccionadaEspecialidad));
  }

  loadHorariosDisponibles(especialistaId: string, especialidadId: string) {
    this.turnoService.obtenerTurnosEspecialistaEspecialidadLibres(especialistaId, especialidadId).subscribe(data => {
      this.horariosDisponibles = data;
      console.log(this.horariosDisponibles.length)
    });
  }

  onFechaSelect(fecha: string, hora: string) {
    this.fechaSelected = fecha;
    this.horaSelected = hora;
  }

  deseleccionarEspecialista()
  {
    this.seleccionadoEspecialista = null;
    this.deseleccionarEspecialidad();
  }  
  
  deseleccionarEspecialidad()
  {
    this.seleccionadaEspecialidad = null;
    this.deseleccionarTurno();
  }

  deseleccionarTurno()
  {
    this.fechaSelected = '';
    this.horaSelected = '';
  }

  deseleccionarPaciente()
  {
    this.seleccionadoPaciente = null;
  }

  onSubmit() {
      this.turnoService.asignarTurnoAPaciente(
        this.fechaSelected, 
        this.horaSelected, 
        this.seleccionadoEspecialista!.nroDocumento, 
        String(this.seleccionadaEspecialidad),
        this.seleccionadoPaciente!.nroDocumento, 
        this.seleccionadoPaciente!.apellido+" "+this.seleccionadoPaciente!.nombre
      ).subscribe(() => {
    });

    Swal.fire({
      position: "center",
      icon: "success",
      title: "El turno fue asignado correctamente.",
      showConfirmButton: false,
      timer: 1500
    });
    this.deseleccionarEspecialista();
  }
}