import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
//import { EspecialidadService } from '../../services/especialidad.service';
//import { TablaEspecialidadesComponent } from '../tabla-especialidades/tabla-especialidades.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
//import { Especialidad } from '../../interfaces/especialidad';
import { Paciente } from '../../interfaces/paciente';
import { PacienteService } from '../../services/paciente.service';
import { ImagenUploadService } from '../../services/imagen-upload.service';

@Component({
  selector: 'app-registrar-paciente',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.css'
})
export class RegistrarPacienteComponent implements OnInit{
  
  fb : FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  registerForm: FormGroup;
  //especialidadService: EspecialidadService = inject(EspecialidadService);
  pacienteService: PacienteService = inject(PacienteService);
  imagenUploadService: ImagenUploadService = inject(ImagenUploadService);
  archivoSeleccionadoUno: File | null = null;
  archivoSeleccionadoDos: File | null = null;


  constructor() {
    const required = Validators.required;
    const minDni = Validators.minLength(7);
    const maxDni = Validators.maxLength(8);
    const numMinDni = Validators.min(1000000);
    const numMaxDni = Validators.max(99999999);
    const minLength = Validators.minLength(2);
    const minLengthCorreo = Validators.minLength(6);
    const correo = Validators.email;
    const prueba = Validators.pattern('^[a-zA-Z0-9_.-]*$');
    const soloLetras = Validators.pattern('^[a-zA-Záéíóú\']*$');

    this.registerForm = this.fb.group({
      nombre: ['', [required, minLength, soloLetras]],
      apellido: ['', [required, minLength, soloLetras]],
      mail: ['', [required, correo]],
      pass: ['', [required, minLengthCorreo]],
      tipoDoc: ['', [required, minLength]],
      nroDocumento: ['', [required, minDni, maxDni, numMinDni, numMaxDni]],
      fechaNac: ['', [required]],
      fotoPerfilUno: ['', [required]],
      fotoPerfilDos: ['', [required]],
      obraSocial: ['', [required]],
      rol: 'paciente',
      activo: true
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    /* if (this.registerForm.valid) {
      const user: Usuario = {
        ...this.registerForm.value,
        role: 'patient'
      };
      this.authService.register(user, this.registerForm.value.pass).then(() => {
        this.router.navigate(['/login']);
      }).catch(error => {
        console.error('Error during registration:', error);
      });
    } */

    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      const paciente: Paciente = this.registerForm.value;
      if (this.archivoSeleccionadoUno && this.archivoSeleccionadoDos) {
        this.imagenUploadService.subirImagen(this.archivoSeleccionadoUno).then((urlUno) => {
          paciente.fotoPerfil = urlUno;
          this.imagenUploadService.subirImagen(this.archivoSeleccionadoDos!).then((urlDos) => {
            paciente.fotoPerfilDos = urlDos;
            this.authService.register(this.registerForm.value.mail, this.registerForm.value.pass).then(() => {
              return this.pacienteService.agregarPaciente(paciente);
            });
          });
        }).then(() => {
          //this.registerForm.reset();
        }).catch(error => {
          console.error('RegistrarPacienteComponent - onSubmit()=> agregarPaciente():', error);
          if (paciente.fotoPerfil) {
            this.imagenUploadService.deleteImage(paciente.fotoPerfil).catch(deleteError => {
              console.error('RegistrarPacienteComponent - onSubmit()=> deleteImage() error borrando imagen uno:', deleteError);
            });
          }if (paciente.fotoPerfilDos) {
            this.imagenUploadService.deleteImage(paciente.fotoPerfilDos).catch(deleteError => {
              console.error('RegistrarPacienteComponent - onSubmit()=> deleteImage() error borrando imagen dos:', deleteError);
            });
          }
        });
      } else {
        console.error('RegistrarPacienteComponent - onSubmit()=> agregarPaciente():', 'No se seleccionaron los archivos');
      }
    }
  }

  onFileSelectedUno(event: Event) : void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.archivoSeleccionadoUno = file;
      this.registerForm.patchValue({ foto: file });
    }
  }

  onFileSelectedDos(event: Event) : void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.archivoSeleccionadoDos = file;
      this.registerForm.patchValue({ foto: file });
    }
  }
}
