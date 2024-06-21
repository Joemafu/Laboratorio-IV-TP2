/* 

* Botones de Acceso rápido 
- Debe ser botones favbutton 
- Debe tener la imagen de perfil del usuario 
- Debe estar en la esquina inferior derecha de la pantalla login. 
  6 usuarios. (3 pacientes, 2 especialistas, 1 admin) 

* Registro de usuarios 
- Al ingresar a la página solo se deben ver 2 botones con la imagen que represente un paciente o especialista,
  según esa elección mostrará el formulario correspondiente. 
- Estas imagenes tienen que estar en botones redondos uno al abajo del otro. 

*/
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./environments/environment.development";

const app = initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));