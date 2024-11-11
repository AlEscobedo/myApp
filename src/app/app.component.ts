import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  categorias: any[] = [];  // Propiedad para almacenar los datos de la colección

  constructor(private firestore: AngularFirestore) {
    this.firestore.collection('Categoria').valueChanges().subscribe(data => {
      console.log(data);  // Opcional: Muestra los datos en la consola
      this.categorias = data;  // Almacena los datos en la propiedad `categorias`
    });
  }
}
