import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecialistaService } from '../../services/especialista.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { TurnoService } from '../../services/turno.service';
import { Especialista } from '../../models/especialista';
import { Especialidad } from '../../interfaces/especialidad';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit{

  turnoForm: FormGroup;
  especialidades: Especialidad[] = [];
  especialistas: Especialista[] = [];
  //horariosDisponibles: string[] = [];
  horariosDisponibles: { fecha: string, horario: string }[] = [];
  //diasDisponibles: string[] = [];
  seleccionadoEspecialista: Especialista | null = null;
  seleccionadaEspecialidad: Especialidad | null = null;

  constructor(
    private fb: FormBuilder,
    private especialistaService: EspecialistaService,
    private especialidadService: EspecialidadService,
    private turnoService: TurnoService
  ) {
    this.turnoForm = this.fb.group({
      especialidad: ['', Validators.required],
      especialista: ['', Validators.required],
      fecha: ['', Validators.required],
      horario: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadEspecialistas();
  }

  loadEspecialidades(especialistaId: string) {
    this.especialistaService.getEspecialidadesByEspecialistaId(especialistaId).subscribe(data => {
      this.especialidades = data;
    });
  }

  loadEspecialistas() {
    this.especialistaService.getEspecialistas().subscribe(data => {
      this.especialistas = data;
    });
  }

  onEspecialistaSelect(especialista: Especialista) {
    this.seleccionadoEspecialista = especialista;
    this.loadEspecialidades(especialista.nroDocumento);
  }

  onEspecialidadSelect(especialidad: Especialidad) {
    this.seleccionadaEspecialidad = especialidad;
    this.loadHorariosDisponibles(this.seleccionadoEspecialista!.id, especialidad.id);
  }

  loadHorariosDisponibles(especialistaId: string, especialidadId: string) {
    this.turnoService.getHorariosDisponibles(especialistaId, especialidadId).subscribe(data => {
      this.horariosDisponibles = data;
    });
  }

  onFechaSelect(fecha: string, horario: string) {
    this.turnoForm.patchValue({ fecha, horario });
  }

  onSubmit() {
    if (this.turnoForm.valid) {
      this.turnoService.agregarTurno(this.turnoForm.value).then(() => {
        alert('Turno solicitado exitosamente');
      });
    }
  }

}
  

/* <!-- BORRADOR - REVISAR --> */
