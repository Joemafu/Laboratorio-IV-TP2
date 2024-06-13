/* 

* Botones de Acceso rápido
- Deben ser botones cuadrados con bordes redondeados
- Deben tener la imagen de perfil del usuario
- Deben estar a la derecha del login, uno abajo del otro, 6 usuarios (3 pacientes, 2 especialistas, 1 admin)

* Registro de usuarios
- Al ingresar a la página solo se deben ver 2 imágenes que represente a un paciente o especialista, según esa elección mostrará un formulario correspondiente.
- Estas imágenes deben estar en botones cuadrados con bordes redondeados

*/
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./environments/environment.development";

const app = initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
