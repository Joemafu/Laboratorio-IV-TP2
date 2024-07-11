import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MisHorariosComponent } from '../mis-horarios/mis-horarios.component';
import { UserService } from '../../services/user.service';
import { CalcularEdadPipe } from '../../pipes/calcular-edad.pipe';
import { MisEspecialistasComponent } from '../mis-especialistas/mis-especialistas.component';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { HistoriaClinica } from '../../interfaces/historia-clinica';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [ CommonModule, FormsModule, MisHorariosComponent, CalcularEdadPipe, MisEspecialistasComponent ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit{

  userService : UserService = inject(UserService);
  usuario = this.userService.personaLogeada;
  mostrarHorarios: boolean = false;
  mostrarHistoriasClinicas: boolean = false;  
  historiaClinicaService: HistoriaClinicaService = inject(HistoriaClinicaService);
  historiasClinicas: HistoriaClinica[] = [];

  constructor() {}

  ngOnInit(): void {
    do{
      this.usuario = this.userService.personaLogeada;
    }while(this.usuario == null || undefined);
  }

  toggleHorarios() {
    this.mostrarHorarios = !this.mostrarHorarios;
    this.getHistoriasClinicas();
  }

  toggleHistoriasClinicas() {
    this.mostrarHistoriasClinicas = !this.mostrarHistoriasClinicas;
  }

  getHistoriasClinicas() {
    this.historiaClinicaService.obtenerHistoriasClinicasPorPaciente(this.userService.personaLogeada.nroDocumento).subscribe(historias => {
      this.historiasClinicas = historias;
    });
  }
}