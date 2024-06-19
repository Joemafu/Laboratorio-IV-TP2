import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Admin } from '../../models/admin';
import { AdminService } from '../../services/admin.service';
import { ImagenUploadService } from '../../services/imagen-upload.service';

@Component({
  selector: 'app-registrar-admin',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './registrar-admin.component.html',
  styleUrl: './registrar-admin.component.css'
})
export class RegistrarAdminComponent  implements OnInit{
  
  fb : FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  registerForm: FormGroup;
  adminService: AdminService = inject(AdminService);
  imagenUploadService: ImagenUploadService = inject(ImagenUploadService);
  archivoSeleccionado: File | null = null;
  errorMensaje: string = '';

  constructor() {
    const required = Validators.required;
    const minDni = Validators.minLength(7);
    const maxDni = Validators.maxLength(8);
    const numMinDni = Validators.min(1000000);
    const numMaxDni = Validators.max(99999999);
    const minLength = Validators.minLength(2);
    const minLengthCorreo = Validators.minLength(6);
    const correo = Validators.pattern('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
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
      rol: 'admin',
      activo: true
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      const admin: Admin = this.registerForm.value;
      if (this.archivoSeleccionado) {
        this.imagenUploadService.subirImagen(this.archivoSeleccionado, this.registerForm.get('nroDocumento')?.value,1).then((urlUno) => {
          admin.fotoPerfil = urlUno;
          this.authService.register(this.registerForm.value.mail, this.registerForm.value.pass).then((mensajeError) => {
            this.errorMensaje = mensajeError;
            return this.adminService.agregarAdmin(admin);
          });
        }).then(() => {
          this.registerForm.reset();
        }).catch(error => {
          console.error('RegistrarAdminComponent - onSubmit()=> agregarAdmin():', error);
          if (admin.fotoPerfil) {
            this.imagenUploadService.deleteImage(admin.fotoPerfil).catch(deleteError => {
              console.error('RegistrarAdminComponent - onSubmit()=> deleteImage() error borrando imagen:', deleteError);
            });
          }
        });
      } else {
        console.error('RegistrarAdminComponent - onSubmit()=> agregarAdmin():', 'No se seleccionó el archivo');
      }
    }
  }

  onFileSelectedUno(event: Event) : void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.archivoSeleccionado = file;
      this.registerForm.patchValue({ foto: file });
    }
  }
}
