import { Injectable, inject } from '@angular/core';
import { Firestore, writeBatch, addDoc, collection, collectionData, getDoc, getDocs, query, where, updateDoc, doc, orderBy } from '@angular/fire/firestore';
import { Turno } from '../interfaces/turno';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PacienteService } from './paciente.service';
import { EspecialistaService } from './especialista.service';
import { Paciente } from '../models/paciente';
import { Especialista } from '../models/especialista';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  private firestore: Firestore = inject(Firestore);
  private PATH: string = 'turnos';

  private pacienteService: PacienteService = inject(PacienteService);
  private especialistaService: EspecialistaService = inject(EspecialistaService);
  
  constructor() {}

  /* REVISAR ESTA LOGICA */
  async agregarTurno(turno: Turno) {
    const turnosRef = collection(this.firestore, this.PATH);
    const q = query(turnosRef, where('especialistaId', '==', turno.especialistaId), where('dia', '==', turno.fecha), /* where('horario', '==', turno.horario) */);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(turnosRef, turno);
      return 'Turno agregado exitosamente';
    } else {
      throw new Error('El turno ya está ocupado');
    }
  }

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

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Se han guardado sus horarios.",
          showConfirmButton: false,
          timer: 2500
        });

      } else {
        throw new Error(`El turno ya está ocupado: ${turno.fecha} ${turno.hora}`);
      }
    }
    await batch.commit();
  }

  getHorariosDisponibles(especialistaId: string, especialidadId: string): Observable<{ fecha: string, horario: string }[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, where('especialistaId', '==', especialistaId), where('especialidadId', '==', especialidadId));
    return collectionData(q, { idField: 'id' }) as Observable<{ fecha: string, horario: string }[]>;
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

  obtenerTodosLosTurnos(): Observable<Turno[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, orderBy('fecha', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Turno[]>;
  }

  actualizarTurno(turnoId: string, cambios: Partial<Turno>): Observable<void> {
    const turnoDocRef = doc(this.firestore, `${this.PATH}/${turnoId}`);
    return from(updateDoc(turnoDocRef, cambios));
  }

  obtenerNombreEspecialista(especialistaId: string): Observable<string> {
    return this.especialistaService.getEspecialistaById(especialistaId).pipe(
      map((especialista: Especialista) => `${especialista.nombre} ${especialista.apellido}`)
    );
  }

  obtenerNombrePaciente(pacienteId: string): Observable<string> {
    return this.pacienteService.getPacienteById(pacienteId).pipe(
      map((paciente: Paciente) => `${paciente.nombre} ${paciente.apellido}`)
    );
  }
}

/* BORRADOR - REVISAR */


/* color primario seleccion : hover */
/* #1c79b8 */