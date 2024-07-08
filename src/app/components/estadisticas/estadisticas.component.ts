import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from '../../services/log.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { jsPDF } from 'jspdf';
//import { CanvasJSChart } from '@canvasjs/angular-charts';
import { CanvasJSAngularChartsModule, CanvasJS, CanvasJSChart } from '@canvasjs/angular-charts';


@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [ CommonModule, FormsModule, CanvasJSAngularChartsModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit{
  logins$!: Observable<any[]>;
  loginLogs: any[] = [];
  turnosPorEspecialidad: any[] = [];
  logService: LogService = inject(LogService);
  turnoService: TurnoService = inject(TurnoService);

  chartOptions: any = null;

















  constructor() {}

  ngOnInit() {
    this.logins$ = this.logService.getUserLogins();

    this.logService.getUserLogins().subscribe(logs => {
      this.loginLogs = logs;
    });

     this.turnoService.getTurnosPorEspecialidad().subscribe(turnos => {
      this.turnosPorEspecialidad = turnos;
      this.generateChart();
    });
  }
  i=-1;

  // ESTE NO FUNCIONA
  generateChart(): void {
    let dataPoints = [];

    // Recorrer this.turnosPorEspecialidad manualmente
    for (let i = 0; i < this.turnosPorEspecialidad.length; i++) {
      let item = this.turnosPorEspecialidad[i];
      dataPoints.push({
        label: item.especialidad,
        y: item.cantidad,
        X: i
      });
    }
  
    this.chartOptions = {
      title: {
        text: "Cantidad de Turnos por Especialidad"
      },
      data: [{
        type: "column",
        dataPoints: dataPoints
      }]
    };
    console.log(this.chartOptions);
    console.log(this.chartOptionsBanana);
  }

  // ESTE SI, NO SÉ QUE DIFERENCIA TIENE
  chartOptionsBanana = {
    title: {
      text: "Cantidad de Turnos por Especialidad"
    },
    data: [{
      type: "column",
      dataPoints: [
      { label: "Psiquiatría",  y: 3  },
      { label: "Cirugía", y: 5  },
      { label: "Psicología", y: 2  }
      ]
    }]                
  };

  descargarPDF(): void {
    const doc = new jsPDF();

    // Agregar logo
    const imgData = '../../../assets/img/logo.png'; // Base64 del logo, puedes convertir tu imagen a base64
    doc.addImage(imgData, 'PNG', 10, 10, 20, 20);

    // Título y fecha
    doc.setFontSize(16);
    doc.text('Informe de Turnos por Especialidad', 70, 20);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 70, 30);

    // Información de los turnos por especialidad
    let y = 50;
    this.turnosPorEspecialidad.forEach((turno, index) => {
      doc.setFontSize(14);
      doc.text(`Especialidad: ${turno.especialidad}`, 10, y);
      doc.setFontSize(12);
      y += 10;
      doc.text(`Cantidad de Turnos: ${turno.cantidad}`, 10, y);
      y += 20; // Espacio entre especialidades

      // Agregar nueva página si es necesario
      if (y > 270) {
        doc.addPage();
        y = 10; // Reiniciar la posición vertical
      }
    });

    doc.save('informe_turnos_por_especialidad.pdf');
  }
}
