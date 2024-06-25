import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, where, collectionData, setDoc, deleteDoc, updateDoc, orderBy } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Especialidad } from '../interfaces/especialidad';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private firestore: Firestore = inject(Firestore);
  private PATH: string = 'especialidades';
  private especialidadesCollection;

  constructor() { 
    this.especialidadesCollection = collection(this.firestore, 'especialidades');
  }

  getEspecialidades(): Observable<Especialidad[]> {
    const col = collection(this.firestore, this.PATH);
    const queryCol = query(col, orderBy('especialidad', 'asc'));
    return collectionData(queryCol, { idField: 'id' }) as Observable<Especialidad[]>;
  }

  async agregarEspecialidad(especialidad: Especialidad) {
    try{
      let especialidades = collection(this.firestore, "especialidades");
      let docRef = await addDoc(especialidades, { especialidad: especialidad.especialidad});
      return docRef.id;
    }catch(error){
      return '';
    }
  }

/*   deleteEspecialidad(id: number): Promise<void> {
    const especialidadDocRef = doc(this.firestore, `especialidades/${id}`);
    return deleteDoc(especialidadDocRef);
  } */

  getEspecialidadById(especialidadId: string): Observable<Especialidad> {
    const docRef = doc(this.firestore, `especialidades/${especialidadId}`);
    return from(getDoc(docRef)).pipe(map(docSnap => docSnap.data() as Especialidad));
  }
}
