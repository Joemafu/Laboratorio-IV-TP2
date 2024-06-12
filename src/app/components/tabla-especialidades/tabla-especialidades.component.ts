import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Especialidad } from '../../interfaces/especialidad';
import { EspecialidadService } from '../../services/especialidad.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-especialidades',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './tabla-especialidades.component.html',
  styleUrl: './tabla-especialidades.component.css'
})
export class TablaEspecialidadesComponent {

  @Output() especialidadSeleccionada: EventEmitter<string> = new EventEmitter<string>();
  especialidadService: EspecialidadService = inject(EspecialidadService);
  especialidades$!: Observable<Especialidad[]>;
  especialidad: Especialidad = { id: '', especialidad: ''};
  especialidades: Especialidad[] = [];
  nextId: number = 1;

  ngOnInit (): void {
    this.especialidades$ = this.especialidadService.getEspecialidades();

    this.especialidades$.subscribe(data => {
      this.especialidades = data;
      this.nextId = this.especialidades.length + 1;
    });
  }

  seleccionarEspecialidad(especialidadId: string) {
    this.especialidadSeleccionada.emit(especialidadId);
  }

  agregarEspecialidad() {

    
    this.especialidadService.agregarEspecialidad(this.especialidad);
    this.especialidad.especialidad = '';
  }

  generarId() {
    this.nextId++;
  }
}
