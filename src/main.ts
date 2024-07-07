/* 

  Cambios Sprint 1

  * Botones de Acceso rápido 
    - Debe ser botones favbutton 
    - Debe tener la imagen de perfil del usuario 
    - Debe estar en la esquina inferior derecha de la pantalla login. 
      6 usuarios. (3 pacientes, 2 especialistas, 1 admin) 

  * Registro de usuarios 
    - Al ingresar a la página solo se deben ver 2 botones con la imagen que represente un paciente o especialista,
      según esa elección mostrará el formulario correspondiente. 
    - Estas imagenes tienen que estar en botones redondos uno al abajo del otro. 


  Cambios Sprint 2

  * Sacar un turno 
    - Comienza mostrando los PROFESIONALES en botones cuadrados con la imagen del mismo 
    - Una vez seleccionado mostrará las ESPECIALIDADES, en botones rectangulares, con la imagen de la especialidad. 
    - En caso de no tener muestra imagen por default. 
    - También debe mostrar el nombre de la especialidad arriba del botón. 
    - Una vez seleccionada la especialidad, aparecerán los días y horarios con turnos disponibles para ese PROFESIONAL.
    - Estos botones deben ser cuadrados. 
    - Formato (2021-09-09 1:15 PM)


    Cambios Sprint 3

    * Sección Pacientes
      - Para los especialistas. 
        - Solo deberá mostrar los usuarios que el especialista haya atendido al menos 1 vez.
        -	Mostrar los usuarios con un favbutton redondo , imagen y nombre, al seleccionar un paciente se muestra los dellaes de los turnos y un acceso a la reseña de cada consulta
    * Sección usuarios
      - Solamente para el perfil Administrador
        - un excel con los datos de los usuarios.
        - Mostrar los usuarios con un favbutton redondo , imagen y nombre.
        - Al seleccionarlo descarga los datos de que turnos tomo y con quien 
    * Mi perfil	
      - Para los usuarios paciente
        - un pdf con la historia clínica. 
        - El PDF tiene que tener logo de la clínica, título del informe y fecha de emisión.
        - Poder bajar Todas las atenciones que realice segun un PROFESIONAL
    * Animaciones	
      - Se debe agregar al menos 2, como mínimo, animaciones de transición entre componentes al navegar la aplicación.
      - Derecha a izquierda

*/
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./environments/environment.development";

const app = initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));