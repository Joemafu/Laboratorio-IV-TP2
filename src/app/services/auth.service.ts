import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, sendEmailVerification, sendPasswordResetEmail } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseAuth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private firestore: Firestore = inject(Firestore);

  public user$ = user(this.firebaseAuth);
  public currentUserSig = signal<Usuario | null | undefined>(undefined);
  public currentUser: string = '';

  public personaLogeada: Usuario | null = null;


  constructor() {

  }

  register(mail: string, password: string): Promise<string> {
    return new Promise<string>((resolve) => {
      createUserWithEmailAndPassword(this.firebaseAuth, mail, password)
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
  
  async login(mail: string, password: string): Promise<string> {
    console.log('Login function called'); // Log when function is called
    return new Promise<string>((resolve) => {
      signInWithEmailAndPassword(this.firebaseAuth, mail, password)
        .then(async (userCredential) => {
          console.log('signInWithEmailAndPassword resolved'); // Log after signInWithEmailAndPassword
          if (userCredential.user && userCredential.user.emailVerified) {
            const user = userCredential.user;
            console.log('User email verified:', user.email); // Log user email if verified
  
            const collections = ['admins', 'pacientes', 'especialistas'];
            let usuarioActivo = false;
  
            for (const collectionName of collections) {
              console.log(`Checking collection: ${collectionName}`);
              const userQuery = query(collection(this.firestore, collectionName), where('mail', '==', user.email));
              const querySnapshot = await getDocs(userQuery);
  
              if (!querySnapshot.empty) {
                console.log(`Found user in collection: ${collectionName}`);
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data() as Usuario;
                this.personaLogeada = userData;
                console.log(`User data: `, userData);
                if (userDoc.exists() && userData['activo']) {
                  usuarioActivo = true;
                  this.currentUserSig.set(userData);
                  break;
                }
              }
            }
            if (usuarioActivo) {
              console.log('Usuario activo, navegando a bienvenida'); // Log if user is active
              this.router.navigate(['/bienvenida']);
              resolve('');
              if (user.email) {
                this.currentUser = user.email;
              }
            } else {
              console.log('Cuenta deshabilitada'); // Log if user is not active
              resolve('Su cuenta se encuentra deshabilitada, póngase en contacto con un administrador.');
              this.logout();
            }
          } else {
            console.log('Email no verificado'); // Log if email not verified
            resolve('Verifique su correo electrónico para activar su cuenta.');
            this.logout();
          }
        })
        .catch(err => {
          console.log('Error en signInWithEmailAndPassword:', err.message); // Log error in catch block
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
      this.personaLogeada = null;
      this.currentUserSig.set(null);
      this.router.navigate(['/login']);
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