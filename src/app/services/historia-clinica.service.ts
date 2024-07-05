import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { HistoriaClinica } from '../interfaces/historia-clinica';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {

  private readonly PATH = 'historiasClinicas';
  firestore: Firestore = inject(Firestore);

  constructor() {}

  //BETA
  obtenerHistoriasClinicasPorPaciente(pacienteId: string): Observable<HistoriaClinica[]> {
    //console.log("paciente ID: ", pacienteId)
    const colRef = collection(this.firestore, this.PATH);
    const q = query(colRef, where('pacienteId', '==', pacienteId));
    return from(getDocs(q)).pipe(
      map(querySnapshot => querySnapshot.docs.map(docSnap => docSnap.data() as HistoriaClinica))
    );
  }

  //BETA
  agregarHistoriaClinica(historiaClinica: HistoriaClinica): Observable<void> {
    const colRef = collection(this.firestore, this.PATH);
    return from(addDoc(colRef, historiaClinica)).pipe(map(() => {}));
  }

  //BETA
  actualizarHistoriaClinica(turnoId: string, historiaClinica: Partial<HistoriaClinica>): Observable<void> {
    const docRef = doc(this.firestore, `${this.PATH}/${turnoId}`);
    return from(updateDoc(docRef, historiaClinica)).pipe(map(() => {}));
  }
}

/* BORRADOR REVISAR */
