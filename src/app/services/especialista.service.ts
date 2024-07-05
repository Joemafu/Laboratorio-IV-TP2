import { Injectable, inject, signal } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, query, collectionData, orderBy } from '@angular/fire/firestore';
import { from, Observable, forkJoin } from 'rxjs';
import { Especialista } from '../models/especialista';
import { map, switchMap  } from 'rxjs/operators';
import { TurnoService } from './turno.service';
import { Turno } from '../interfaces/turno';
import { Paciente } from '../models/paciente';
import { PacienteService } from './paciente.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  private firestore: Firestore = inject(Firestore);
  private PATH: string = 'especialistas';
  public especialistasSignal = signal<Especialista[] | null | undefined>(undefined);
  public especialistas: Especialista[] = [];
  public especialistas$!: Observable<Especialista[]>;
  private turnoService: TurnoService = inject(TurnoService);
  private pacienteService: PacienteService = inject(PacienteService);

  constructor() { 
    this.especialistas$ = this.getEspecialistas();
  }

  getEspecialistas(): Observable<Especialista[]> {
    const col = collection(this.firestore, this.PATH);
    const queryCol = query(col, orderBy('apellido', 'asc'));
    return collectionData(queryCol, { idField: 'id' }) as Observable<Especialista[]>;
  }

  public async agregarEspecialista(especialista: Especialista) {
    try{
      let especialistas = collection(this.firestore, this.PATH);
      let docRef = await addDoc(especialistas, especialista);
      especialista.id = docRef.id;
      return docRef.id;
    }catch(error){
      return '';
    }
  }

  getEspecialistaById(especialistaId: string): Observable<Especialista> {
    const docRef = doc(this.firestore, `especialistas/${especialistaId}`);
    return from(getDoc(docRef)).pipe(map(docSnap => docSnap.data() as Especialista));
  }

  getPacientesByEspecialista(especialistaId: string): Observable<Paciente[]> {
    console.log("EspecialistaId: ", especialistaId);
    return this.turnoService.obtenerTurnosTomadosPorEspecialista(especialistaId).pipe(
      map((turnos: Turno[]) => {
        console.log("Turnos: ", turnos);
        const pacienteIds = Array.from(new Set(turnos.map(turno => turno.pacienteId).filter(id => id !== undefined))) as string[];
        console.log("PacienteIds A: ", pacienteIds);
        return pacienteIds;
      }),
      switchMap((pacienteIds: string[]) => {
        console.log("PacienteIds B: ", pacienteIds);
        const pacienteObservables = pacienteIds.map(id => this.pacienteService.getPacienteById(id));
        console.log("Pacientes Obs: ", pacienteObservables);
        return forkJoin(pacienteObservables);
      })
    );
  }
}
