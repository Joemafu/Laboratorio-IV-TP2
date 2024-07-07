import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MisHorariosComponent } from '../mis-horarios/mis-horarios.component';
import { UserService } from '../../services/user.service';
import { CalcularEdadPipe } from '../../pipes/calcular-edad.pipe';
import { HistoriasClinicasComponent } from '../historias-clinicas/historias-clinicas.component';
import { MisEspecialistasComponent } from '../mis-especialistas/mis-especialistas.component';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [ CommonModule, FormsModule, MisHorariosComponent, CalcularEdadPipe, HistoriasClinicasComponent, MisEspecialistasComponent ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit{

  userService : UserService = inject(UserService);
  usuario = this.userService.personaLogeada;
  mostrarHorarios: boolean = false;
  mostrarHistoriasClinicas: boolean = false;
  pacienteId: string = this.userService.personaLogeada.nroDocumento;

  constructor() {}

  ngOnInit(): void {}

  toggleHorarios() {
    this.mostrarHorarios = !this.mostrarHorarios;
  }

  toggleHistoriasClinicas() {
    this.mostrarHistoriasClinicas = !this.mostrarHistoriasClinicas;
  }
}
