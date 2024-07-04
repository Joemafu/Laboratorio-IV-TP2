import { Component, OnInit, inject } from '@angular/core';
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

  protected historiasClinicas: HistoriaClinica[] = [];
  historiaClinicaService: HistoriaClinicaService = inject(HistoriaClinicaService);
  userService: UserService = inject(UserService);

  constructor() {}

  ngOnInit(): void {
    const pacienteId = this.userService.personaLogeada.documentoNro;
    this.historiaClinicaService.obtenerHistoriasClinicasPorPaciente(pacienteId).subscribe(historia => {
      this.historiasClinicas = historia;
    });
  }  
}
