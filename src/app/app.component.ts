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
      console.log(data);  // Opcional: Muestra los datos en la consola
      this.categorias = data;  // Almacena los datos en la propiedad `categorias`
    });
    this.firestore.collection('Productos').valueChanges().subscribe(data => {
      console.log(data);  // Opcional: Muestra los datos en la consola
      this.productos = data;  // Almacena los datos en la propiedad `categorias`
    });
  }
  // Método para agregar una nueva categoría
  agregarCategoria() {
    if (this.nuevaCategoria.trim() === '') {
      console.log('El nombre de la categoría no puede estar vacío');
      return;
    }

    const categoria = { nombre: this.nuevaCategoria };  // Define la estructura de la categoría
    this.baseDatosService.agregarCategoria(categoria).then(() => {
      console.log('Categoría agregada con éxito');
      this.nuevaCategoria = '';  // Limpia el campo de la nueva categoría
    }).catch(error => {
      console.error('Error al agregar categoría: ', error);
    });
  }
}
