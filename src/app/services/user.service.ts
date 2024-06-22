import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, doc, query, collectionData, updateDoc, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Especialista } from '../models/especialista';
import { Paciente } from '../models/paciente'

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

  actualizarEstadoUsuario(collectionPath: string, id: string, activo: boolean) {
    const docRef = doc(this.firestore, `${collectionPath}/${id}`);
    return updateDoc(docRef, { activo });
  }
}