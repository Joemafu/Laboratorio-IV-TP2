import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Admin } from '../../models/admin';
import { AdminService } from '../../services/admin.service';
import { ImagenUploadService } from '../../services/imagen-upload.service';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { recaptchaSiteKey } from '../../../environments/environment.development';

@Component({
  selector: 'app-registrar-admin',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, RecaptchaModule, RecaptchaFormsModule ],
  templateUrl: './registrar-admin.component.html',
  styleUrl: './registrar-admin.component.css'
})
export class RegistrarAdminComponent  implements OnInit{
  
  fb : FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  registerForm: FormGroup;
  adminService: AdminService = inject(AdminService);
  imagenUploadService: ImagenUploadService = inject(ImagenUploadService);
  archivoSeleccionado: File | null = null;
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
      rol: 'admin',
      activo: true,
      recaptcha: [null, [required]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.errorMensaje = '';
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.registerForm.markAsPristine();
      const admin: Admin = this.registerForm.value;
      if (this.archivoSeleccionado) {
        this.imagenUploadService.subirImagen(this.archivoSeleccionado, this.registerForm.get('nroDocumento')?.value,1).then((urlUno) => {
          admin.fotoPerfil = urlUno;
          this.authService.register(admin.mail, admin.pass).then((mensajeError) => {
            if (mensajeError){
              this.errorMensaje = mensajeError;
              return Promise.reject(mensajeError);
            }    
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
  
  resolved(token: any): void {
    this.captchaOk = true;
    this.captchaToken = token;
  }
}
