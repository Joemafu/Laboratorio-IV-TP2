import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { TablaEspecialidadesComponent } from '../tabla-especialidades/tabla-especialidades.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Especialidad } from '../../interfaces/especialidad';
import { Especialista } from '../../interfaces/especialista';
import { EspecialistaService } from '../../services/especialista.service';
import { ImagenUploadService } from '../../services/imagen-upload.service';

@Component({
  selector: 'app-registrar-especialista',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, TablaEspecialidadesComponent, FormsModule ],
  templateUrl: './registrar-especialista.component.html',
  styleUrl: './registrar-especialista.component.css'
})
export class RegistrarEspecialistaComponent implements OnInit {
  
  fb : FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  registerForm: FormGroup;
  especialidadService: EspecialidadService = inject(EspecialidadService);
  especialistaService: EspecialistaService = inject(EspecialistaService);
  imagenUploadService: ImagenUploadService = inject(ImagenUploadService);
  archivoSeleccionado: File | null = null;

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
      fotoPerfil: ['', [required]],
      especialidad: ['', [required]],
      rol: 'especialista',
      activo: false
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      const especialista: Especialista = this.registerForm.value;
      if (this.archivoSeleccionado) {
        this.imagenUploadService.subirImagen(this.archivoSeleccionado).then((url) => {
          especialista.fotoPerfil = url;
          this.authService.register(this.registerForm.value.mail, this.registerForm.value.pass).then(() => {
            return this.especialistaService.agregarEspecialista(especialista);
          });
        }).then(() => {
          //this.registerForm.reset();
        }).catch(error => {
          console.error('RegistrarEspecialistaComponent - onSubmit()=> agregarEspecialista():', error);
          if (especialista.fotoPerfil) {
            this.imagenUploadService.deleteImage(especialista.fotoPerfil).catch(deleteError => {
              console.error('RegistrarEspecialistaComponent - onSubmit()=> deleteImage():', deleteError);
            });
          }
        });
      } else {
        console.error('RegistrarEspecialistaComponent - onSubmit()=> agregarEspecialista():', 'No se seleccionó archivo');
      }
    }
  }

  onEspecialidadSeleccionada(id: string): void {
    this.especialidadService.getEspecialidadById(id).subscribe((espec: Especialidad) => {
      this.registerForm.patchValue({ especialidad: espec.especialidad});
    });
  }

  onFileSelected(event: Event) : void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.archivoSeleccionado = file;
      this.registerForm.patchValue({ foto: file });
    }
  }
}
