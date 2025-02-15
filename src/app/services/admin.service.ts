import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, query, collectionData, orderBy } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Admin } from '../models/admin';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private firestore: Firestore = inject(Firestore);
  private PATH: string = 'admins';
  public adminsCollection;

  constructor() {
    this.adminsCollection = collection(this.firestore, this.PATH);
   }

   getAdmins(): Observable<Admin[]> {
    const col = collection(this.firestore, this.PATH);
    const queryCol = query(col, orderBy('apellido', 'asc'));
    return collectionData(queryCol, { idField: 'id' }) as Observable<Admin[]>;
  }

  public async agregarAdmin(admin: Admin) {
    try{
      let admins = collection(this.firestore, this.PATH);
      let docRef = await addDoc(admins, admin);
      admin.id = docRef.id;
      return docRef.id;
    }catch(error){
      console.error('AdminService - agregarAdmin():', error);
      return '';
    }
  }

  getAdminById(adminId: string): Observable<Admin> {
    const docRef = doc(this.firestore, `admins/${adminId}`);
    return from(getDoc(docRef)).pipe(map(docSnap => docSnap.data() as Admin));
  }
}

