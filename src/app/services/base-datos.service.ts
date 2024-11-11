import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BaseDatosService {

  constructor(private firestore: AngularFirestore) { }

  // Método para obtener categorías
  obtenerCategorias(): Observable<any[]> {
    return this.firestore.collection('Categoria').valueChanges();
  }
  
}
