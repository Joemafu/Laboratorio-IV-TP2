import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService } from '../../services/log.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { jsPDF } from 'jspdf';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import * as XLSX from 'xlsx';
import { EspecialistaService } from '../../services/especialista.service';

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
  turnosPorDia: any[] = [];
  turnosPorEspecialista: any[] = [];
  turnosFinalizadosPorEspecialista: any[] = [];
  inicio = new Date();
  fin = new Date();

  logService: LogService = inject(LogService);
  turnoService: TurnoService = inject(TurnoService);
  especialistaService: EspecialistaService = inject(EspecialistaService);

  chartOptionsTurnosPorEspecialidad: any = null;
  chartOptionsTurnosPorDia: any = null;
  chartOptionsTurnosPorEspecialista: any = null;
  chartOptionsTurnosFinalizadosPorEspecialista: any = null;

  toggleChartUno = false;

  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @ViewChild('chartContainerDia') chartContainerDia!: ElementRef;
  @ViewChild('chartContainerEspecialista') chartContainerEspecialista!: ElementRef;
  @ViewChild('chartContainerFinalizadosEspecialista') chartContainerFinalizadosEspecialista!: ElementRef;

  constructor() {}

  ngOnInit() {
    this.logins$ = this.logService.getUserLogins();

    this.logService.getUserLogins().subscribe(logs => {
      this.loginLogs = logs;
    });

     this.turnoService.getTurnosPorEspecialidad().subscribe(turnos => {
      this.turnosPorEspecialidad = turnos;
      this.sortTurnosPorEspecialidad();
    });

    this.turnoService.getTurnosPorDia().subscribe(turnos => {
      this.turnosPorDia = turnos;
      this.sortTurnosPorDia();
    });

    this.especialistaService.getTurnosPorEspecialistaEnLapsoDeTiempo(this.inicio, this.fin).subscribe(turnos => {
      this.turnosPorEspecialista = turnos;
      this.sortTurnosPorEspecialista();
    });

    this.especialistaService.getTurnosFinalizadosPorEspecialistaEnLapsoDeTiempo(this.inicio, this.fin).subscribe(turnos => {
      this.turnosFinalizadosPorEspecialista = turnos;
      this.sortTurnosFinalizadosPorEspecialista();
    });
  }

  sortTurnosPorEspecialidad(): void {
    this.turnosPorEspecialidad.sort((a, b) => b.cantidad - a.cantidad);
    this.generateChartTurnosPorEspecialidad();
  }

  sortTurnosPorDia(): void {
    this.turnosPorDia.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    this.generateChartTurnosPorDia();
  }

  sortTurnosPorEspecialista(): void {
    this.turnosPorEspecialista.sort((a, b) => b.cantidad - a.cantidad);
    this.generateChartTurnosPorEspecialista();
  }

  sortTurnosFinalizadosPorEspecialista(): void {
    this.turnosPorEspecialista.sort((a, b) => b.cantidad - a.cantidad);
    this.generateChartTurnosFinalizadosPorEspecialista();
  }

  generateChartTurnosPorEspecialidad(): void {
    let dataPoints = [];

    for (let i = 0; i < this.turnosPorEspecialidad.length; i++) {
      let item = this.turnosPorEspecialidad[i];
      dataPoints.push({
        label: item.especialidad,
        y: item.cantidad,
        x: i
      });
    }
    this.chartOptionsTurnosPorEspecialidad = {
      title: {
        text: "Cantidad de Turnos por Especialidad"
      },
      data: [{
        type: "column",
        dataPoints: dataPoints
      }]
    };
  }

  generateChartTurnosPorDia(): void {
    let dataPoints = [];

    for (let i = 0; i < this.turnosPorDia.length; i++) {
      let item = this.turnosPorDia[i];
      dataPoints.push({
        label: item.fecha,
        y: item.cantidad,
        x: i
      });
    }
    this.chartOptionsTurnosPorDia = {
      title: {
        text: "Cantidad de Turnos por Día"
      },
      data: [{
        type: "column",
        dataPoints: dataPoints
      }]
    };
  }

  generateChartTurnosPorEspecialista(): void {
    let dataPoints = this.turnosPorEspecialista.map((item, index) => ({
      label: item.especialista,
      y: item.cantidad,
      x: index
    }));

    this.chartOptionsTurnosPorEspecialista = {
      title: {
        text: "Cantidad de Turnos por Especialista"
      },
      data: [{
        type: "column",
        dataPoints: dataPoints
      }]
    };
  }

  generateChartTurnosFinalizadosPorEspecialista(): void {
    let dataPoints = this.turnosFinalizadosPorEspecialista.map((item, index) => ({
      label: item.especialista,
      y: item.cantidad,
      x: index
    }));

    this.chartOptionsTurnosFinalizadosPorEspecialista = {
      title: {
        text: "Cantidad de Turnos Finalizados por Especialista"
      },
      data: [{
        type: "column",
        dataPoints: dataPoints
      }]
    };
  }

  actualizarInformesPorFecha(): void {
    this.toggleChartUno = true;
    const inicioDate = new Date(this.inicio);
    const finDate = new Date(this.fin);
    this.especialistaService.getTurnosPorEspecialistaEnLapsoDeTiempo(inicioDate, finDate).subscribe(turnos => {
      this.turnosPorEspecialista = turnos;
      this.sortTurnosPorEspecialista();
    });
    this.especialistaService.getTurnosFinalizadosPorEspecialistaEnLapsoDeTiempo(inicioDate, finDate).subscribe(turnos => {
      this.turnosFinalizadosPorEspecialista = turnos;
      this.sortTurnosFinalizadosPorEspecialista();
    });
  }

  descargarLogs(): void {
    const logsData = this.loginLogs.map(log => {
      const date = new Date(log.timestamp.seconds * 1000 + log.timestamp.nanoseconds / 1000000);
      const fecha = date.toLocaleDateString();
      const hora = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        Usuario: log.userId,
        Fecha: fecha,
        Hora: hora
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(logsData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Logins');
    XLSX.writeFile(wb, 'logins.xlsx');
  }

  descargarTurnosPorEspecialidadPDF(): void {
    const doc = new jsPDF();
    const imgData = '../../../assets/img/logo.png';
    doc.addImage(imgData, 'PNG', 10, 10, 20, 20);

    doc.setFontSize(16);
    doc.text('Informe de turnos por especialidad', 70, 20);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 70, 30);

    let y = 50;
    this.turnosPorEspecialidad.forEach((turno, index) => {
      doc.setFontSize(14);
      doc.text(`Especialidad: ${turno.especialidad}`, 10, y);
      doc.setFontSize(12);
      y += 10;
      doc.text(`Cantidad de turnos: ${turno.cantidad}`, 10, y);
      y += 20;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    const chartElement = this.chartContainer.nativeElement.querySelector('canvas');
    if (chartElement) {
      const chartImage = chartElement.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 50, y, 100, 100);
    }
    doc.save('informe_turnos_por_especialidad.pdf');
  }

  descargarTurnosPorDiaPDF(): void {
    const doc = new jsPDF();
    const imgData = '../../../assets/img/logo.png';
    doc.addImage(imgData, 'PNG', 10, 10, 20, 20);

    doc.setFontSize(16);
    doc.text('Informe de turnos por día', 70, 20);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 70, 30);

    let y = 50;
    this.turnosPorDia.forEach((turno, index) => {
      doc.setFontSize(14);
      doc.text(`Fecha: ${turno.fecha}`, 10, y);
      doc.setFontSize(12);
      y += 10;
      doc.text(`Cantidad de turnos: ${turno.cantidad}`, 10, y);
      y += 20;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    const chartElement = this.chartContainerDia.nativeElement.querySelector('canvas');
    if (chartElement) {
      const chartImage = chartElement.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 50, y, 100, 100);
    }
    doc.save('informe_turnos_por_dia.pdf');
  }

  descargarTurnosPorEspecialistaPDF(): void {
    const doc = new jsPDF();
    const imgData = '../../../assets/img/logo.png';
    doc.addImage(imgData, 'PNG', 10, 10, 20, 20);

    doc.setFontSize(16);
    doc.text(`Informe de turnos por especialista`, 70, 20);
    doc.setFontSize(16);
    doc.text(`del ${this.inicio} al ${this.fin}`, 70, 27);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 70, 34);

    let y = 50;
    this.turnosPorEspecialista.forEach((turno, index) => {
      doc.setFontSize(14);
      doc.text(`Especialista: ${turno.especialista}`, 10, y);
      doc.setFontSize(12);
      y += 10;
      doc.text(`Cantidad de turnos: ${turno.cantidad}`, 10, y);
      y += 20;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    const chartElement = this.chartContainerEspecialista.nativeElement.querySelector('canvas');
    if (chartElement) {
      const chartImage = chartElement.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 50, y, 100, 100);
    }
    doc.save('informe_turnos_por_especialista.pdf');
  }

  descargarTurnosFinalizadosPorEspecialistaPDF(): void {
    const doc = new jsPDF();
    const imgData = '../../../assets/img/logo.png';
    doc.addImage(imgData, 'PNG', 10, 10, 20, 20);

    doc.setFontSize(16);
    doc.text(`Informe de turnos finalizados por especialista`, 70, 20);
    doc.setFontSize(16);
    doc.text(`del ${this.inicio} al ${this.fin}`, 70, 27);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 70, 34);

    let y = 50;
    this.turnosFinalizadosPorEspecialista.forEach((turno, index) => {
      doc.setFontSize(14);
      doc.text(`Especialista: ${turno.especialista}`, 10, y);
      doc.setFontSize(12);
      y += 10;
      doc.text(`Cantidad de turnos: ${turno.cantidad}`, 10, y);
      y += 20;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    const chartElement = this.chartContainerFinalizadosEspecialista.nativeElement.querySelector('canvas');
    if (chartElement) {
      const chartImage = chartElement.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 50, y, 100, 100);
    }
    doc.save('informe_turnos_finalizados_por_especialista.pdf');
  }
}