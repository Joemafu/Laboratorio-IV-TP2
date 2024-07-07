import { Component, OnInit, inject, Input } from '@angular/core';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { HistoriaClinica } from '../../interfaces/historia-clinica';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historias-clinicas',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './historias-clinicas.component.html',
  styleUrl: './historias-clinicas.component.css'
})
export class HistoriasClinicasComponent implements OnInit {
  @Input() pacienteId: string = '';
  protected historiasClinicas: HistoriaClinica[] = [];
  historiaClinicaService: HistoriaClinicaService = inject(HistoriaClinicaService);
  userService: UserService = inject(UserService);
  documentoNro: string = '';
  

  constructor() {}

  ngOnInit(): void {
    this.cargarHistoriasClinicas();
  }

  cargarHistoriasClinicas() {
    this.historiaClinicaService.obtenerHistoriasClinicasPorPaciente(this.pacienteId).subscribe(historias => {
      this.historiasClinicas = historias;
    });
  }
}
