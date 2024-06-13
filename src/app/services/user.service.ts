import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, where, collectionData, setDoc, deleteDoc, updateDoc, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { Especialista } from '../interfaces/especialista';
import { Paciente } from '../interfaces/paciente'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore: Firestore = inject(Firestore);
  private PATHUNO: string = 'pacientes';
  private PATHDOS: string = 'especialistas';
  public paciente$: Observable<Paciente[]>;
  public especialista$: Observable<Especialista[]>;
  /* private pacientesCollection;
  private especialistasCollection; */

  constructor() {
    this.paciente$ = this.getPacientes();
    this.especialista$ = this.getEspecialistas();
  }

  getPacientes(): Observable<Paciente[]> {
    const col = collection(this.firestore, this.PATHUNO);
    const queryCol = query(col, orderBy('apellido', 'asc'));
    return collectionData(queryCol, { idField: 'id' }) as Observable<Paciente[]>;
  }

  getEspecialistas(): Observable<Especialista[]> {
    const col = collection(this.firestore, this.PATHDOS);
    const queryCol = query(col, orderBy('apellido', 'asc'));
    return collectionData(queryCol, { idField: 'id' }) as Observable<Especialista[]>;
  }

  /* public async agregarEspecialidad(especialidad: Especialidad) {
    try{
      let especialidades = collection(this.firestore, "especialidades");
      let docRef = await addDoc(especialidades, { especialidad: especialidad.especialidad});
      return docRef.id;
    }catch(error){
      return '';
    }
  } */

  /* getEspecialidadById(especialidadId: string): Observable<Especialidad> {
    const docRef = doc(this.firestore, `especialidades/${especialidadId}`);
    return from(getDoc(docRef)).pipe(map(docSnap => docSnap.data() as Especialidad));
  } */

  activarEspecialista(usuario: Usuario) {
    let docRef = doc(this.firestore, `especialistas/${usuario.uid}`);
    return updateDoc(docRef, { activo: true });
  }

  desactivarEspecialista(usuario: Usuario) {
    let docRef = doc(this.firestore, `especialistas/${usuario.uid}`);
    return updateDoc(docRef, { activo: false });
  }

  activarPaciente(usuario: Usuario) {
    let docRef = doc(this.firestore, `pacientes/${usuario.uid}`);
    return updateDoc(docRef, { activo: true });
  }

  desactivarPaciente(usuario: Usuario) {
    let docRef = doc(this.firestore, `pacientes/${usuario.uid}`);
    return updateDoc(docRef, { activo: false });
  }
}