import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoriaClinica } from '../../interfaces/historia-clinica';

@Component({
  selector: 'app-form-historia-clinica',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './form-historia-clinica.component.html',
  styleUrl: './form-historia-clinica.component.css'
})
export class FormHistoriaClinicaComponent {

datoDinamicoUno = { clave: '', valor: '' };
datoDinamicoDos = { clave: '', valor: '' };
datoDinamicoTres = { clave: '', valor: '' };

  historiaClinica: HistoriaClinica = {
    turnoId: '',
    fechaTurno: '',
    pacienteId: '',
    altura: 0,
    peso: 0,
    temperatura: 0,
    presion: '',
    datoDinamicoUno: { clave: '', valor: '' },
    datoDinamicoDos: { clave: '', valor: '' },
    datoDinamicoTres: { clave: '', valor: '' }
  };

  @Output() historiaClinicaGuardada = new EventEmitter<HistoriaClinica>();

  onSubmit() {
    this.historiaClinica.datoDinamicoUno = this.datoDinamicoUno;
    this.historiaClinica.datoDinamicoDos = this.datoDinamicoDos;
    this.historiaClinica.datoDinamicoTres = this.datoDinamicoTres;
    this.historiaClinicaGuardada.emit(this.historiaClinica);
  }
}
