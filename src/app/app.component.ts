import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseDatosService } from './services/base-datos.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  categorias: any[] = [];  // Propiedad para almacenar los datos de la colección
  nuevaCategoria: string = '';  // Propiedad para la nueva categoría
  productos: any[] = [];  // Propiedad para almacenar los datos de la colección  

  constructor(private firestore: AngularFirestore, private baseDatosService: BaseDatosService) {
    this.firestore.collection('Categoria').valueChanges().subscribe(data => {      
      this.categorias = data;  // Almacena los datos en la propiedad `categorias`
    });
    this.firestore.collection('Productos').valueChanges().subscribe(data => {
      this.productos = data;  // Almacena los datos en la propiedad `categorias`
    });
  }
}
