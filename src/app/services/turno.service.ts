import { Injectable, inject } from '@angular/core';
import { Firestore, writeBatch, collection, collectionData, getDocs, query, where, updateDoc, doc, orderBy } from '@angular/fire/firestore';
import { Turno } from '../interfaces/turno';
import { from, Observable, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  private firestore: Firestore = inject(Firestore);
  private PATH: string = 'turnos';
  
  constructor() {}

  async agregarTurnos(turnos: Turno[]): Promise<void> {
    console.log(turnos);
    const batch = writeBatch(this.firestore);
    const turnosRef = collection(this.firestore, this.PATH);

    for (const turno of turnos) {
      const q = query(turnosRef, where('especialistaId', '==', turno.especialistaId), where('fecha', '==', turno.fecha), where('hora', '==', turno.hora));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const turnoDocRef = doc( this.firestore, `${this.PATH}/${this.firestore.app.options.projectId}_${Date.now()}`);
        batch.set(turnoDocRef, { ...turno, id: turnoDocRef.id });
      } else {
        throw new Error(`El turno ya está ocupado: ${turno.fecha} ${turno.hora}`);
      }
    }
    await batch.commit();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Se han guardado sus horarios.",
      showConfirmButton: false,
      timer: 1500
    });
  }

  obtenerTurnosEspecialistaEspecialidad(especialistaId: string, especialidad: string): Observable<{ fecha: string, hora: string }[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, where('especialistaId', '==', especialistaId), where('especialidad', '==', especialidad));
    return collectionData(q, { idField: 'id' }) as Observable<{ fecha: string, hora: string }[]>;
  }

  obtenerTurnosEspecialistaEspecialidadLibres(especialistaId: string, especialidad: string): Observable<{ fecha: string, hora: string }[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, where('especialistaId', '==', especialistaId), where('especialidad', '==', especialidad), where('estado', '==', 'Libre'));
    return collectionData(q, { idField: 'id' }) as Observable<{ fecha: string, hora: string }[]>;
  }

  asignarTurnoAPaciente(
    dia: string,
    hora: string,
    especialistaDNI: string,
    especialidad: string,
    pacienteId: string,
    pacienteNombre: string
  ): Observable<void> {
    const col = collection(this.firestore, this.PATH);
    const q = query(
      col,
      where('especialistaId', '==', especialistaDNI),
      where('fecha', '==', dia),
      where('hora', '==', hora),
      where('especialidad', '==', especialidad)
    );

    return from(getDocs(q)).pipe(
      mergeMap(querySnapshot => {
        if (querySnapshot.empty) {
          return throwError(new Error('No se encontró el turno'));
        }
        const turno = querySnapshot.docs[0].data() as { id: string };
        const estado = 'Pendiente' 
        return from(updateDoc(doc(this.firestore, `${this.PATH}/${turno.id}`), { pacienteId, pacienteNombre, estado }));
      }),
      catchError(error => {
        console.error('Error al asignar el turno al paciente:', error);
        return throwError(error);
      })
    );
  }

  obtenerTurnosPorPaciente(pacienteId: string): Observable<Turno[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, where('pacienteId', '==', pacienteId), orderBy('fecha', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Turno[]>;
  }

  obtenerTurnosPorEspecialista(especialistaId: string): Observable<Turno[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, where('especialistaId', '==', especialistaId), orderBy('fecha', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Turno[]>;
  }

  obtenerTurnosTomadosPorEspecialista(especialistaId: string): Observable<Turno[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, where('especialistaId', '==', especialistaId), where('pacienteNombre', '!=', ''), orderBy('fecha', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Turno[]>;
  }

  obtenerTodosLosTurnos(): Observable<Turno[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, where('pacienteNombre', '!=', ''), orderBy('fecha', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Turno[]>;
  }

  actualizarTurno(turnoId: string, cambios: Partial<Turno>): Observable<void> {
    const turnoDocRef = doc(this.firestore, `${this.PATH}/${turnoId}`);
    return from(updateDoc(turnoDocRef, cambios));
  }
}

/* color primario seleccion : hover */
/* #1c79b8 */