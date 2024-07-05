import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { HistoriaClinica } from '../../interfaces/historia-clinica';
import { Turno } from '../../interfaces/turno';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TurnoService } from '../../services/turno.service';

@Component({
  selector: 'app-form-historia-clinica',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form-historia-clinica.component.html',
  styleUrl: './form-historia-clinica.component.css'
})
export class FormHistoriaClinicaComponent {
  @Input() turno!: Turno;
  @Output() historiaClinicaGuardada = new EventEmitter<HistoriaClinica>();

  errorMensaje: string = '';
  fb: FormBuilder = inject(FormBuilder);
  historiaClinicaForm: FormGroup;
  turnoService = inject(TurnoService);

  constructor() {
    const required = Validators.required;
    const valmin = Validators.min(0.1);

    this.historiaClinicaForm = this.fb.group({
      altura: [0, [required, valmin]],
      peso: [0, [required, valmin]],
      temperatura: [0, [required, valmin]],
      presion: [0, [required, valmin]],
      resenia: ['', [required]],
      claveUno: [''],
      valorUno: [''],
      claveDos: [''],
      valorDos: [''],
      claveTres: [''],
      valorTres: ['']
    });
  }

  historiaClinica: HistoriaClinica = {
    turnoId: '',
    pacienteId: '',
    pacienteNombre: '',
    fechaTurno: '',
    altura: 0,
    peso: 0,
    temperatura: 0,
    presion: 0,
    datoDinamicoUno: { clave: '', valor: '' },
    datoDinamicoDos: { clave: '', valor: '' },
    datoDinamicoTres: { clave: '', valor: '' }
  };

  ngOnChanges(): void {
    if (this.turno) {
      this.historiaClinica.turnoId = this.turno.id;
      this.historiaClinica.pacienteId = this.turno.pacienteId;
      this.historiaClinica.fechaTurno = this.turno.fecha;
    }
  }

  onSubmit() {
    this.errorMensaje = '';
    this.historiaClinicaForm.markAllAsTouched();
    if(this.historiaClinicaForm.valid) {
      this.historiaClinicaForm.markAsPristine();
      this.historiaClinica.pacienteId = this.turno.pacienteId,
      this.historiaClinica.pacienteNombre = this.turno.pacienteNombre,
      this.historiaClinica.fechaTurno = this.turno.fecha+' '+this.turno.hora,
      this.historiaClinica.altura = this.historiaClinicaForm.get('altura')?.value;
      this.historiaClinica.peso = this.historiaClinicaForm.get('peso')?.value;
      this.historiaClinica.temperatura = this.historiaClinicaForm.get('temperatura')?.value;
      this.historiaClinica.presion = this.historiaClinicaForm.get('presion')?.value;
      if(this.historiaClinicaForm.get('claveUno')?.value && this.historiaClinicaForm.get('valorUno')?.value) {
        this.historiaClinica.datoDinamicoUno = { clave: this.historiaClinicaForm.get('claveUno')?.value, valor: this.historiaClinicaForm.get('valorUno')?.value };
      }
      if(this.historiaClinicaForm.get('claveDos')?.value && this.historiaClinicaForm.get('valorDos')?.value) {
        this.historiaClinica.datoDinamicoDos = { clave: this.historiaClinicaForm.get('claveDos')?.value, valor: this.historiaClinicaForm.get('valorDos')?.value };
      }
      if(this.historiaClinicaForm.get('claveTres')?.value && this.historiaClinicaForm.get('valorTres')?.value) {
        this.historiaClinica.datoDinamicoTres = { clave: this.historiaClinicaForm.get('claveTres')?.value, valor: this.historiaClinicaForm.get('valorTres')?.value };
      }
      this.historiaClinicaGuardada.emit(this.historiaClinica);
      return this.turnoService.actualizarTurno(this.turno.id, { estado: 'Finalizado', reseniaMedico: this.historiaClinicaForm.get("resenia")?.value }).toPromise();
    }
    return this.errorMensaje = 'Por favor, complete los campos requeridos.';
  }
}
