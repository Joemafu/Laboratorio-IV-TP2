import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, sendEmailVerification, sendPasswordResetEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseAuth: Auth = inject(Auth);
  private router: Router = inject(Router);
  public user$ = user(this.firebaseAuth);
  public currentUserSig = signal<Usuario | null | undefined>(undefined);
  public currentUser: string = '';

  constructor() {}

  register(email: string, password: string): Promise<string> {
    return new Promise<string>((resolve) => {
      createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((userCredential) => {

        this.sendVerificationEmail(userCredential.user).then(() => {
          resolve('');
          //this.logout();
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
              mensajeError = 'Error al registrar usuario.';
              break;
          }
          resolve(mensajeError);
        });
    });
  }
  
  login(email: string, password: string) : Promise <string> {
    return new Promise<string>((resolve) => {
      signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((userCredential) => {
        if (userCredential.user && userCredential.user.emailVerified)
        {
          const user = userCredential.user;
          this.router.navigate(['/bienvenida']);
          resolve('');
          if (user.email) {
            this.currentUser = user.email;
          }     
        } 
        else
        {
          resolve('Verifique su correo electrónico para activar su cuenta.');
          this.logout();
        }     
      })
      .catch( err => {
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
            mensajeError = 'Error al iniciar sesión.';
            break;
        }
        resolve(mensajeError);
      });
    });
  }

  logout() {
    signOut(this.firebaseAuth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  async resetPassword(email: string): Promise<string> {
    return new Promise<string>((resolve) => {
      sendPasswordResetEmail(this.firebaseAuth, email).then(() => {
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

  async sendVerificationEmail(user: any): Promise<string> {
    sendEmailVerification(user).then(() => {
      console.log('Email de verificación enviado');
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

}