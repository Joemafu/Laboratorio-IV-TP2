import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, where, collectionData, setDoc, deleteDoc, updateDoc, orderBy } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Especialista } from '../models/especialista';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  private firestore: Firestore = inject(Firestore);
  private PATH: string = 'especialistas';
  private especialistasCollection;

  constructor() { 
    this.especialistasCollection = collection(this.firestore, this.PATH);
  }

  getEspecialistas(): Observable<Especialista[]> {
    const col = collection(this.firestore, this.PATH);
    const queryCol = query(col, orderBy('apellido', 'asc'));
    return collectionData(queryCol, { idField: 'id' }) as Observable<Especialista[]>;
  }

  public async agregarEspecialista(especialista: Especialista) {
    try{
      let especialistas = collection(this.firestore, this.PATH);
      let docRef = await addDoc(especialistas, { especialista: especialista});
      return docRef.id;
    }catch(error){
      return '';
    }
  }

  /* deleteEspecialista(id: number): Promise<void> {
    const especialistaDocRef = doc(this.firestore, `especialistas/${id}`);
    return deleteDoc(especialistaDocRef);
  } */

  getEspecialistaById(especialistaId: string): Observable<Especialista> {
    const docRef = doc(this.firestore, `especialistas/${especialistaId}`);
    return from(getDoc(docRef)).pipe(map(docSnap => docSnap.data() as Especialista));
  }
}
