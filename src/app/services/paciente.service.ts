import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, where, getDocs, query, collectionData, orderBy } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Paciente } from '../models/paciente';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private firestore: Firestore = inject(Firestore);
  private PATH: string = 'pacientes';
  public pacientesCollection;

  constructor() {
    this.pacientesCollection = collection(this.firestore, this.PATH);
   }

   getPacientes(): Observable<Paciente[]> {
    const col = collection(this.firestore, this.PATH);
    const queryCol = query(col, orderBy('apellido', 'asc'));
    return collectionData(queryCol, { idField: 'id' }) as Observable<Paciente[]>;
  }

  public async agregarPaciente(paciente: Paciente) {
    try{
      let pacientes = collection(this.firestore, this.PATH);
      let docRef = await addDoc(pacientes, paciente);
      paciente.id = docRef.id;
      return docRef.id;
    }catch(error){
      console.error('PacienteService - agregarPaciente():', error);
      return '';
    }
  }

  getPacienteById(pacienteId: string): Observable<Paciente> {
    const pacientesRef = collection(this.firestore, 'pacientes');
    const q = query(pacientesRef, where('nroDocumento', '==', pacienteId));
    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        if (querySnapshot.empty) {
          throw new Error(`No patient found with nroDocumento: ${pacienteId}`);
        }
        return querySnapshot.docs[0].data() as Paciente;
      })
    );
  }
}