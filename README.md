Applicación web "La Clínica Online" Proyecto final de la materia "Laboratorio de Computación IV" de la UTN

https://clinicatp2laboiv.web.app/bienvenida


Pagina de inicio de sesión:

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/e2d67004-4da9-43da-8635-ec8ed402554b)

Abajo a la derecha tenemos los accesos rápidos para poder testear las funcionalidades.



Como especialista:


Mi perfil: Desde acá podemos ver la información personal del especialista, o acceder a "Mis Horarios", para setear la disponibilidad del mismo.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/ab245639-5a93-47d1-9dbd-51bf5afc0609)


Mis Horarios: Seleccionamos la especialidad a cubrir, el día y los turnos a abrir. En gris nuestra selección y en gris apagado los turnos que ya generamos previamente.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/7545f289-4adb-47fc-bb71-a39e3fe45780)


Turnos: Desde esta pantalla podemos visualizar el historial de turnos, estado del mismo e información adicional como motivo de la cancelación en caso de que el turno haya sido cancelado. También podemos aceptar o rechazar turnos pendientes o darlos por finalizados para cargar los datos del paciente que se sumarán a su historia clínica.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/02e6cfbb-c992-4edf-8d61-8d0a5c0f03bd)


Carga de información médica del paciente posterior a su visita.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/6608918f-c35c-4325-a7eb-2e0937291c98)



Pacientes: Acá podemos visualizar a los pacientes atendidos y al seleccionar uno visualizaremos lista de turnos de éste, así como un acceso rápido a su historial médico.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/17e7d4e4-6f2e-4ad2-8202-0a7fed4cd2bd)



![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/0edb5217-71c4-4373-9d1a-8033038d3bf4)



Como paciente:


Mi perfil: Desde acá podemos ver la información personal del paciente, o acceder a "Mi historial clínico", para visualizar los registro médicos personales.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/ed036e3c-5330-444d-aa1d-2c1be3790d7b)



Mi Historial Clínico: Desde acá podemos ver los especialistas con los que nos hemos atendido. Seleccionando uno por su imagen, vemos el listado de turnos pendientes, cancelados o finalizados, y tenemos la posibilidad de completar una encuesta de satisfacción, así como puntuar nuestra experiencia del 1 al 5 o ver el resultado del diagnóstico del especialista.
También podemos consultar nuestro historial médico o descargar la información de los turnos en formato xlsx.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/b545cfad-d56c-48c0-9edc-0a0b4b4e78ad)
![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/2707c90d-b26b-4492-be01-366cb25097a5)



Turnos: Acá podemos gestionar los turnos, filtrar por espeicalidad, especialista o datos de la historia clínica o diagnóstico. Ver todos los pendientes, finalizados y cancelados, así como cancelar, calificar, completar encuestas, ver comentario o diagnóstico y obviamente solicitar uno nuevo a partir de un especialista, especialidad y horario.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/a0c7e97f-2606-419c-b0a3-3c208e722c4e)
![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/70dd781b-f85c-4936-b4dc-6314669e46e6)
![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/69015f87-9e09-4425-ad8e-d6d3c7b1eb2f)
![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/5e821b2c-061f-408c-a214-320f4cb455b3)




Como administrador:

Mi perfil: nuevamente, podemos observar la información personal del usuario logeado.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/2947863d-3e78-49e0-b4f4-b854e6e10f67)


Registro: Acá podemos registrar nuevos usuarios. Especialistas, pacientes o un nuevo administrador. Cada uno con su propio formulario acorde a la información que se le requiere. 

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/07526d1b-9f7d-4dd5-8ddb-b80174613e04)
![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/0840229a-b328-4fe4-8587-a7da43ebf124)
![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/2ed64ec1-1a77-4e62-ab6b-6bbae35ffeae)
![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/2af7368e-ab1a-4ab0-82da-2ba6e372a29a)


Todos validados con sus campos obligatorios validados contra campos vacíos o datos incongruentes, y securizados por captcha.

![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/fc5330a6-9309-4327-a3b9-3b8b5bef5220)
![imagen](https://github.com/Joemafu/Laboratorio-IV-TP2/assets/52410521/efd69f57-8a35-4cbf-940e-0c480705911b)





















































# ClinicaTP2LaboIV

Este proyecto fue creado con [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

## Servidor de desarrollo

Ejecuta `ng serve` para levantar un servidor de desarrollo. Navegar a `http://localhost:4200/` para acceder a la app. La aplicación se actualiza automáticamente si se modifican los archivos fuente.

## Precompilar

Ejecuta `ng build` para precompilar el proyecto. Los artefactos precompilados se almacenan en la carpeta `dist/`.

## Más ayuda

Para obtener más ayuda sobre Angular CLI ejecuta `ng help` o visita la página de [Angular CLI Overview and Command Reference](https://angular.io/cli).
