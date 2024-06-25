import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Paciente } from '../../models/paciente';
import { PacienteService } from '../../services/paciente.service';
import { ImagenUploadService } from '../../services/imagen-upload.service';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { recaptchaSiteKey } from '../../../environments/environment.development';

@Component({
  selector: 'app-registrar-paciente',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, RecaptchaModule, RecaptchaFormsModule ],
  templateUrl: './registrar-paciente.component.html',
  styleUrl: './registrar-paciente.component.css'
})
export class RegistrarPacienteComponent implements OnInit{
  
  fb : FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  registerForm: FormGroup;
  pacienteService: PacienteService = inject(PacienteService);
  imagenUploadService: ImagenUploadService = inject(ImagenUploadService);
  archivoSeleccionadoUno: File | null = null;
  archivoSeleccionadoDos: File | null = null;
  errorMensaje: string = '';

  captchaOk: boolean = false;
  siteKey: string = recaptchaSiteKey;
  captchaToken: string | null = null;


  constructor() {
    const required = Validators.required;
    const minDni = Validators.minLength(7);
    const maxDni = Validators.maxLength(8);
    const numMinDni = Validators.min(1000000);
    const numMaxDni = Validators.max(99999999);
    const minLength = Validators.minLength(2);
    const minLengthCorreo = Validators.minLength(6);
    const correo = Validators.pattern('^[a-zA-Z0-9_.-]{3,}@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}$');
    const nombre = Validators.pattern('^[a-zA-Z áéíóú]*$');
    const apellido = Validators.pattern('^[a-zA-Z áéíóú\']*$');
    const formatoImagen = Validators.pattern(/\.(jpg|jpeg|png|webp)$/i);

    this.registerForm = this.fb.group({
      nombre: ['', [required, minLength, nombre]],
      apellido: ['', [required, minLength, apellido]],
      mail: ['', [required, correo]],
      pass: ['', [required, minLengthCorreo]],
      tipoDoc: ['', [required, minLength]],
      nroDocumento: ['', [required, minDni, maxDni, numMinDni, numMaxDni]],
      fechaNac: ['', [required]],
      fotoPerfil: ['', [required, formatoImagen]],
      fotoPerfilDos: ['', [required, formatoImagen]],
      obraSocial: ['', [required]],
      rol: 'Paciente',
      activo: true,
      recaptcha: [null, [required]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    /* this.authService.verifyCaptcha(this.captchaToken!).subscribe(response => {
      if (response.success) {
       */
        this.errorMensaje = '';
        this.registerForm.markAllAsTouched();
        if (this.registerForm.valid) {
          const paciente: Paciente = this.registerForm.value;
          if (this.archivoSeleccionadoUno && this.archivoSeleccionadoDos) {
            this.imagenUploadService.subirImagen(this.archivoSeleccionadoUno, this.registerForm.get('nroDocumento')?.value,1).then((urlUno) => {
              paciente.fotoPerfil = urlUno;
              this.imagenUploadService.subirImagen(this.archivoSeleccionadoDos!, this.registerForm.get('nroDocumento')?.value,2).then((urlDos) => {
                paciente.fotoPerfilDos = urlDos;
                this.authService.register(paciente.mail, paciente.pass, paciente.nroDocumento).then((mensajeError) => {
                  if (mensajeError){
                    this.errorMensaje = mensajeError;
                    return Promise.reject(mensajeError);
                  }    
                  return this.pacienteService.agregarPaciente(paciente);          
                });
              });
            }).then(() => {
              this.registerForm.reset();
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
      /* }
    });  */
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
  
  resolved(token: any): void {
    this.captchaOk = true;
    this.captchaToken = token;
  }
}
