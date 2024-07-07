import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../models/paciente';
import { Especialista } from '../../models/especialista';
import { Subscription } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HistoriasClinicasComponent } from '../historias-clinicas/historias-clinicas.component';
import { MisPacientesComponent } from '../mis-pacientes/mis-pacientes.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-administrar-usuarios',
  standalone: true,
  imports: [ CommonModule, MatSlideToggleModule, HistoriasClinicasComponent, MisPacientesComponent ],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.css'
})

export class AdministrarUsuariosComponent implements OnInit {

  protected pacientes: Paciente[] = [];
  protected especialistas: Especialista[] = [];
  private userService: UserService = inject(UserService);
  private pacienteSubscription: Subscription = new Subscription();
  private especialistaSubscription: Subscription = new Subscription();
  protected toogleHistoriaClinica: boolean = false;
  idPacienteSeleccionado: string = '';

  constructor() {}

  ngOnInit(): void {
    this.especialistaSubscription = this.userService.especialistas$.subscribe((especialistas) => {
      if (especialistas) {
        this.especialistas = especialistas;
      }
      else {
        this.especialistas = [];
      }
    });
    this.pacienteSubscription = this.userService.pacientes$.subscribe((pacientes) => {
      if (pacientes) {
        this.pacientes = pacientes;
      }
      else {
        this.pacientes = [];
      }
    });
  }  

  ngOnDestroy(): void {
    this.pacienteSubscription.unsubscribe();
    this.especialistaSubscription.unsubscribe();
  }

  toggleUsuarioActivo(usuario: Paciente | Especialista, activo: boolean) {
    const collectionPath = usuario.rol === 'Paciente' ? this.userService.PATHUNO : this.userService.PATHDOS;
    this.userService.actualizarEstadoUsuario(collectionPath, usuario.id, activo).then(() => {
      usuario.activo = activo;
    }).catch(error => {
      console.error('Error actualizando estado: ', error);
    });
  }

  verHistoriaClinica(paciente: Paciente) {
    this.toggleHistoriasClinicas();
    this.idPacienteSeleccionado = paciente.nroDocumento;
  }

  toggleHistoriasClinicas() {
    this.toogleHistoriaClinica = !this.toogleHistoriaClinica;
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  descargarDatosusuariosExcel() {

    const usuariosFiltrados = this.pacientes.concat(this.especialistas).map(usuario => ({
        Nombre: usuario.nombre,
        Apellido: usuario.apellido,
        DNI: usuario.nroDocumento,
        "Fecha de Nacimiento": usuario.fechaNac,
        Email: usuario.mail,
        "Obra Social": usuario.obraSocial ? usuario.obraSocial : 'N/A',
        Rol: usuario.rol,
        Activo: usuario.activo,
        Especialidad: usuario.especialidades ? usuario.especialidades.join(', ') : 'N/A',
        'Foto de perfil': usuario.fotoPerfil,
        'Foto de perfil secundaria': usuario.fotoPerfilDos ? usuario.fotoPerfilDos : 'N/A'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(usuariosFiltrados);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    
    XLSX.writeFile(wb, 'usuarios.xlsx');
  }
}
