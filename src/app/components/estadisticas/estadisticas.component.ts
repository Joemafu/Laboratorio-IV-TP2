import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from '../../services/log.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { jsPDF } from 'jspdf';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

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

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  constructor() {}

  ngOnInit() {
    this.logins$ = this.logService.getUserLogins();

    this.logService.getUserLogins().subscribe(logs => {
      this.loginLogs = logs;
    });

     this.turnoService.getTurnosPorEspecialidad().subscribe(turnos => {
      this.turnosPorEspecialidad = turnos;
      this.sortturnosPorEspecialidad();
    });
  }

  sortturnosPorEspecialidad(): void {
    this.turnosPorEspecialidad.sort((a, b) => b.cantidad - a.cantidad);
    this.generateChart();
  }

  generateChart(): void {
    let dataPoints = [];

    for (let i = 0; i < this.turnosPorEspecialidad.length; i++) {
      let item = this.turnosPorEspecialidad[i];
      dataPoints.push({
        label: item.especialidad,
        y: item.cantidad,
        x: i
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
  }

  descargarPDF(): void {
    const doc = new jsPDF();
    const imgData = '../../../assets/img/logo.png';
    doc.addImage(imgData, 'PNG', 10, 10, 20, 20);

    doc.setFontSize(16);
    doc.text('Informe de Turnos por Especialidad', 70, 20);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 70, 30);

    let y = 50;
    this.turnosPorEspecialidad.forEach((turno, index) => {
      doc.setFontSize(14);
      doc.text(`Especialidad: ${turno.especialidad}`, 10, y);
      doc.setFontSize(12);
      y += 10;
      doc.text(`Cantidad de Turnos: ${turno.cantidad}`, 10, y);
      y += 20;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    const chartElement = this.chartContainer.nativeElement.querySelector('canvas');
    if (chartElement) {
      const chartImage = chartElement.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 10, y, 180, 100);
    }

    doc.save('informe_turnos_por_especialidad.pdf');
  }
}
