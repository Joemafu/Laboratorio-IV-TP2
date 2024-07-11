import { Component, OnInit, inject, Input } from '@angular/core';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { HistoriaClinica } from '../../interfaces/historia-clinica';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../services/turno.service';
import { jsPDF } from 'jspdf';
import { FormatearFechaPipe } from '../../pipes/formatear-fecha.pipe';
import { HighlightButtonDirective } from '../../directives/highlight-button.directive';

@Component({
  selector: 'app-historias-clinicas',
  standalone: true,
  imports: [ CommonModule, FormatearFechaPipe, HighlightButtonDirective],
  templateUrl: './historias-clinicas.component.html',
  styleUrl: './historias-clinicas.component.css'
})
export class HistoriasClinicasComponent implements OnInit {
  @Input() pacienteId: string = '';
  @Input() especialistaId: string = '';
  @Input() historiasClinicas: HistoriaClinica[] = [];
  historiaClinicaService: HistoriaClinicaService = inject(HistoriaClinicaService);
  userService: UserService = inject(UserService);
  documentoNro: string = '';  
  turnoService: TurnoService = inject(TurnoService);
  resenia: string = '';

  constructor() {}

  ngOnInit(): void {
    if(this.pacienteId || this.especialistaId)
    {
      this.cargarHistoriasClinicas();
    }    
  }

  cargarHistoriasClinicas() {
    if (this.especialistaId) {
      this.pacienteId = this.userService.personaLogeada.nroDocumento;
      this.historiaClinicaService.obtenerHistoriasClinicasPorPacienteYEspecialista(this.pacienteId, this.especialistaId).subscribe(historias => {
        this.historiasClinicas = historias;
        this.obtenerResenia(historias[0].turnoId);
      });
    } else if (this.pacienteId){
      this.historiaClinicaService.obtenerHistoriasClinicasPorPaciente(this.pacienteId).subscribe(historias => {
        this.historiasClinicas = historias;
      });
    }
  }

  public descargarHistoriaClinicaPdf(historiasClinicas: HistoriaClinica[]) {
    const doc = new jsPDF();

    const imgData = '../../../assets/img/logo.png';
    doc.addImage(imgData, 'PNG', 10, 10, 20, 20);

    doc.setFontSize(16);
    doc.text('Informe de Historias Clínicas', 70, 20);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 70, 30);

    let y = 50;
    historiasClinicas.forEach((historia, index) => {
      doc.setFontSize(14);
      doc.text(`Historia Clínica ${index + 1} - Turno del ${historia.fechaTurno} hs.`, 10, y);
      doc.setFontSize(12);
      y += 10;
      doc.text(`Altura: ${historia.altura} cm`, 10, y);
      y += 10;
      doc.text(`Peso: ${historia.peso} kg`, 10, y);
      y += 10;
      doc.text(`Temperatura: ${historia.temperatura} °C`, 10, y);
      y += 10;
      doc.text(`Presión: ${historia.presion} mm/Hg`, 10, y);
      y += 10;
      if (historia.datoDinamicoUno?.clave) {
        doc.text(`${historia.datoDinamicoUno.clave}: ${historia.datoDinamicoUno.valor}`, 10, y);
        y += 10;
      }
      if (historia.datoDinamicoDos?.clave) {
        doc.text(`${historia.datoDinamicoDos.clave}: ${historia.datoDinamicoDos.valor}`, 10, y);
        y += 10;
      }
      if (historia.datoDinamicoTres?.clave) {
        doc.text(`${historia.datoDinamicoTres.clave}: ${historia.datoDinamicoTres.valor}`, 10, y);
        y += 10;
      }

      doc.text(`Reseña/Diagnóstico: ${this.resenia}`, 10, y);


      y += 20;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save('historias_clinicas.pdf');
  }

  async obtenerResenia(id : string)
  {
    console.log('obtenerResenia', id);
    await this.turnoService.obtenerResenia(id).subscribe(resenia => {
      this.resenia = resenia;
    });
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',      
    });
  }
}
