import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, where, collectionData, setDoc, deleteDoc, updateDoc, orderBy } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Paciente } from '../models/paciente';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

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

  /* deletePaciente(id: number): Promise<void> {
    const pacienteDocRef = doc(this.firestore, `pacientes/${id}`);
    return deleteDoc(pacienteDocRef);
  } */

    getPacienteById(pacienteId: string): Observable<Paciente> {
      const docRef = doc(this.firestore, `pacientes/${pacienteId}`);
      return from(getDoc(docRef)).pipe(map(docSnap => docSnap.data() as Paciente));
    }

    

}

