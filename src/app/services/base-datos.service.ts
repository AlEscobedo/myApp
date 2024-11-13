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

  // Método para agregar una nueva categoría
  agregarCategoria(categoria: any): Promise<void> {
    const id = this.firestore.createId();  // Crea un ID único para la nueva categoría
    return this.firestore.collection('Categoria').doc(id).set(categoria);  // Agrega la categoría a Firestore
  }

  // Método para actualizar el nombre de una categoría
  actualizarCategoriaPorNombre(nombreCategoria: string, nuevoNombre: string): Promise<void> {
    return this.firestore.collection('Categoria', ref => ref.where('categoria', '==', nombreCategoria))
      .get()
      .toPromise()
      .then(snapshot => {
        if (snapshot && !snapshot.empty) {
          // Obtener el id del primer documento encontrado
          const docRef = snapshot.docs[0].ref;
          return docRef.update({ categoria: nuevoNombre });  // Actualiza el nombre de la categoría
        } else {
          throw new Error('No se encontró ninguna categoría con ese nombre');
        }
      });
  }
  


  eliminarCategoriaPorNombre(nombreCategoria: string): Promise<void> {
    return this.firestore.collection('Categoria', ref => ref.where('categoria', '==', nombreCategoria))
      .get()
      .toPromise()
      .then(snapshot => {
        if (snapshot && !snapshot.empty) {  // Verificación explícita de snapshot
          const batch = this.firestore.firestore.batch();
          snapshot.forEach(doc => {
            batch.delete(doc.ref);
          });
          return batch.commit();
        } else {
          throw new Error('No se encontró ninguna categoría con ese nombre');
        }
      });
  }

}
