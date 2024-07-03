import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MisHorariosComponent } from '../mis-horarios/mis-horarios.component';
import { UserService } from '../../services/user.service';
import { CalcularEdadPipe } from '../../pipes/calcular-edad.pipe';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [ CommonModule, FormsModule, MisHorariosComponent, CalcularEdadPipe ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit{

  /* Esto es para todos los usuarios */
  userService : UserService = inject(UserService);
  usuario = this.userService.personaLogeada;
  mostrarHorarios: boolean = false;

  ngOnInit(): void {
  }

  /* Esto es para los especialistas */
  toggleHorarios() {
    this.mostrarHorarios = !this.mostrarHorarios;
  }
}
