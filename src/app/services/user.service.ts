import { Injectable, inject, signal } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, where, collectionData, setDoc, deleteDoc, updateDoc, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Especialista } from '../models/especialista';
import { Paciente } from '../models/paciente'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firestore: Firestore = inject(Firestore);
  public PATHUNO: string = 'pacientes';
  public PATHDOS: string = 'especialistas';
  public especialistasSignal = signal<Especialista[] | null | undefined>(undefined);
  public especialistas: Especialista[] = [];
  public especialistas$: Observable<Especialista[]>;
  public pacientesSignal = signal<Paciente[] | null | undefined>(undefined);
  public pacientes: Paciente[] = [];
  public pacientes$: Observable<Paciente[]>;
  /* private pacientesCollection;
  private especialistasCollection; */

  constructor() {
    this.pacientes$ = this.getPacientes();
    this.especialistas$ = this.getEspecialistas();
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

  /* getUsersForTable(): Observable<Especialista[]> {
    let c = collection(this.firestore, 'especialistas');
    return collectionData(c, { idField: 'id' }) as Observable<Especialista[]>;
  } */

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












/*   activarEspecialista(usuario: Usuario) {
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
  } */

    /* actualizarEstadoUsuario(usuario: Usuario, activo: boolean) {
      const collectionPath = usuario.rol === 'paciente' ? this.PATHUNO : this.PATHDOS;
      const docRef = doc(this.firestore, `${collectionPath}/${usuario.uid}`);
      return updateDoc(docRef, { activo: activo });







      if (usuario.rol === 'paciente') {
        let docRef = doc(this.firestore, `pacientes/${usuario.uid}`);
        return updateDoc(docRef, { activo: activo });
      } else if (usuario.rol === 'especialista') {
        let docRef = doc(this.firestore, `especialistas/${usuario.uid}`);
        return updateDoc(docRef, { activo: activo });
      }
    } */




  actualizarEstadoUsuario(collectionPath: string, id: string, activo: boolean) {
    const docRef = doc(this.firestore, `${collectionPath}/${id}`);
    return updateDoc(docRef, { activo });
  }
}