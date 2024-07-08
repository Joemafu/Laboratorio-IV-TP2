import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, sendEmailVerification, sendPasswordResetEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { recaptchaSecretKey } from '../../environments/environment.development';
import  Swal from 'sweetalert2';
import { UserService } from './user.service';
import { LogService } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseAuth: Auth = inject(Auth);
  private router: Router = inject(Router);

  public user$ = user(this.firebaseAuth);
  public currentUserSig = signal<Usuario | null | undefined>(undefined);
  public currentUser: string = '';

  public http: HttpClient = inject(HttpClient);
  private secretKey = recaptchaSecretKey;

  public userService: UserService = inject(UserService);

  private logService: LogService = inject(LogService);

  constructor() {}

  async register(mail: string, password: string, nroDocumento: string): Promise<string> {

    if(await this.userService.documentoRegistrado(nroDocumento))
    {
      return Promise.resolve('El número de documento ya se encuentra registrado.');
    }

    return new Promise<string>((resolve) => {
      createUserWithEmailAndPassword(this.firebaseAuth, mail, password)
      .then((userCredential) => {

        this.sendVerificationEmail(userCredential.user).then(() => {
          resolve('');
        });
        })
        .catch(err => {
          let mensajeError = '';
          switch (err.message) {
            case 'Firebase: Password should be at least 6 characters (auth/weak-password).':
              mensajeError = 'La contraseña debe tener al menos 6 caracteres';
              break;
            case 'Firebase: Error (auth/invalid-email).':
              mensajeError = 'Ingrese un correo válido.';
              break;
            case 'Firebase: Error (auth/email-already-in-use).':
              mensajeError = 'El correo indicado ya se encuentra registrado.';
              break;
            case 'Firebase: Error (auth/missing-password).':
              mensajeError = 'Ingrese una contraseña.';
              break;
            default:
              mensajeError = 'Error al registrar usuario: ' + err.message;
              break;
          }
          resolve(mensajeError);
        });
    });
  }
  
  login(mail: string, password: string): Promise<string> {
    return new Promise<string>((resolve) => {
      signInWithEmailAndPassword(this.firebaseAuth, mail, password)
        .then(async (userCredential) => {
          if (userCredential.user && userCredential.user.emailVerified) {
            const user = userCredential.user;

            await this.userService.getUsuarioPorCorreo(user.email!);

            if(this.userService.usuarioActivo())
            {
              this.currentUserSig.set(this.userService.personaLogeada);
              this.router.navigate(['/bienvenida']);
              resolve('');
              if (user.email) {
                this.currentUser = user.email;
              }
              await this.logService.logUserLogin(user.email!);
            } else {
              resolve('Su cuenta se encuentra deshabilitada, póngase en contacto con un administrador.');
              this.logout();
            }
          } else {
            resolve('Verifique su correo electrónico para activar su cuenta.');
            this.logout();
          }
        })
        .catch(err => {
          let mensajeError = '';
          switch (err.message) {
            case 'Firebase: Error (auth/invalid-credential).':
              mensajeError = 'Credenciales inválidas.';
              break;
            case 'Firebase: Error (auth/invalid-email).':
              mensajeError = 'Ingrese un correo válido.';
              break;
            case 'Firebase: Error (auth/missing-password).':
              mensajeError = 'Ingrese una contraseña.';
              break;
            default:
              mensajeError = 'Error al iniciar sesión.'+ err.message;
              break;
          }
          resolve(mensajeError);
        });
    });
  }  

  logout() {
    signOut(this.firebaseAuth).then(() => {
      this.currentUserSig.set(null);
      this.router.navigate(['/login']);
      this.userService.borrarPersonaLogeada();
    });
  }

  resetPassword(mail: string): Promise<string> {
    return new Promise<string>((resolve) => {
      sendPasswordResetEmail(this.firebaseAuth, mail).then(() => {
        resolve('Se ha enviado un correo para restablecer la contraseña.');
      })
      .catch(err => {
        let mensajeError = '';
        switch (err.message) {
          case 'Firebase: Error (auth/invalid-email).':
            mensajeError = 'Ingrese un correo válido.';
            break;
          case 'Firebase: Error (auth/user-not-found).':
            mensajeError = 'El correo indicado no se encuentra registrado.';
            break;
          default:
            mensajeError = 'Error';
            break;
        }
        resolve(mensajeError);
      });
    });
  }

  sendVerificationEmail(user: any): Promise<string> {
    sendEmailVerification(user).then(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha enviado un correo de validación.",
        showConfirmButton: false,
        timer: 1500
      });
    })
    .catch(err => {
      let mensajeError = '';
      switch (err.message) {
        case 'Firebase: Error (auth/too-many-requests).':
          mensajeError = 'Demasiados intentos. Intente más tarde.';
          break;
        default:
          mensajeError = 'Error al enviar el correo de verificación.';
          break;
      }
      return mensajeError;
    });
    return Promise.resolve('Email de verificación enviado');
  }

  verifyCaptcha(captchaResponse: string): Observable<{ success: boolean }>{
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${this.secretKey}&response=${captchaResponse}`;
    return this.http.post<{ success: boolean }>(url, {});
  }
}