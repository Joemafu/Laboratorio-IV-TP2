import { Injectable, inject, signal } from '@angular/core';
import { Firestore, addDoc, collection, where, getDocs, query, collectionData, orderBy } from '@angular/fire/firestore';
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
    const especialistasRef = collection(this.firestore, 'especialistas');
    const q = query(especialistasRef, where('nroDocumento', '==', especialistaId));
    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        if (querySnapshot.empty) {
          throw new Error(`No hay especialistas con DNI: ${especialistaId}`);
        }
        return querySnapshot.docs[0].data() as Especialista;
      })
    );
  }

  getPacientesByEspecialista(especialistaId: string): Observable<Paciente[]> {
    return this.turnoService.obtenerTurnosTomadosPorEspecialista(especialistaId).pipe(
      map((turnos: Turno[]) => {
        const pacienteIds = Array.from(new Set(turnos.map(turno => turno.pacienteId).filter(id => id !== undefined))) as string[];
        return pacienteIds;
      }),
      switchMap((pacienteIds: string[]) => {
        const pacienteObservables = pacienteIds.map(id => this.pacienteService.getPacienteById(id));
        return forkJoin(pacienteObservables);
      })
    );
  }

  getEspecialistasByPaciente(pacienteId: string): Observable<Especialista[]> {
    return this.turnoService.obtenerTurnosPorPaciente(pacienteId).pipe(
      map((turnos: Turno[]) => {
        const especialistaIds = Array.from(new Set(turnos.map(turno => turno.especialistaId))) as string[];
        return especialistaIds;
      }),
      switchMap((especialistaIds: string[]) => {
        const especialistaObservables = especialistaIds.map(id => this.getEspecialistaById(id));
        return forkJoin(especialistaObservables);
      })
    );
  }

  //BETA
  getTurnosPorEspecialistaEnLapsoDeTiempo(inicio: Date, fin: Date): Observable<any[]> {
    return this.turnoService.obtenerTodosLosTurnos().pipe(
      map((turnos: Turno[]) => {
        const turnosFiltrados = turnos.filter(turno => {
          const fechaTurno = new Date(turno.fecha);
          return fechaTurno >= inicio && fechaTurno <= fin;
        });
        
        const turnosPorMedico = turnosFiltrados.reduce((acc: any, turno: Turno) => {
          const medico = turno.especialistaNombre;
          if (!acc[medico]) {
            acc[medico] = 0;
          }
          acc[medico]++;
          return acc;
        }, {});

        return Object.keys(turnosPorMedico).map(medico => ({
          medico,
          cantidad: turnosPorMedico[medico]
        }));
      })
    );
  }
}
