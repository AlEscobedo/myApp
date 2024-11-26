import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { getStorage, ref } from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Asegúrate de tener esta importación
import { finalize } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BaseDatosService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  // Método para obtener categorías
  obtenerCategorias(): Observable<any[]> {
    return this.firestore.collection('Categoria').valueChanges();
  }

  // Método para obtener categorías
  obtenerProductos(): Observable<any[]> {
    return this.firestore.collection('Productos').valueChanges();
  }

  obtenerUsuarios(): Observable<any[]> {
    return this.firestore.collection('Usuario').valueChanges();
  }

  // Función para agregar un producto a la base de datos
  agregarProducto(producto: any, archivo: File): Promise<void> {
    const storagePath = `productos_imagenes/${producto.nombreProducto}`;
    const fileRef = this.storage.ref(storagePath);
    const uploadTask = this.storage.upload(storagePath, archivo);

    return new Promise((resolve, reject) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            // Ahora que tenemos la URL de la imagen, la guardamos en Firestore
            const productoRef = this.firestore.collection('Productos').doc(producto.nombreProducto.toUpperCase());
            productoRef.set({
              nombre: producto.nombreProducto,
              descripcion: producto.descripcionProducto,
              precioPequeno: producto.precioPequenoProducto,
              precioGrande: producto.precioGrandeProducto,
              disponible: producto.estadoProducto,
              categoria: producto.categoria,
              imagen: url  // Guardamos la URL de la imagen en Firestore
            }).then(resolve).catch(reject);
          });
        })
      ).subscribe();
    });
  }


  // Método para agregar una nueva categoría
  agregarCategoria(categoria: any): Promise<void> {
    const id = this.firestore.createId();  // Crea un ID único para la nueva categoría
    return this.firestore.collection('Categoria').doc(id).set(categoria);  // Agrega la categoría a Firestore
  }

  eliminarUsuarioPorRut(rut: string): Promise<void> {
    return this.firestore
      .collection('Usuario', ref => ref.where('rut', '==', rut))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (querySnapshot && !querySnapshot.empty) {
          // Si encontramos el documento con ese RUT, lo eliminamos
          const docId = querySnapshot.docs[0].id;
          return this.firestore.collection('Usuario').doc(docId).delete();
        } else {
          throw new Error('Usuario no encontrado');
        }
      });
  }
  
  
  async actualizarUsuario(usuario: any): Promise<void> {
    try {
      // Esperar a que el query se resuelva
      const querySnapshot = await this.firestore
        .collection('Usuario', ref => ref.where('rut', '==', usuario.rut))
        .get()
        .toPromise();  // Convierte el Observable en una Promesa para usar await
  
      // Comprobar si querySnapshot es undefined o vacío
      if (!querySnapshot || querySnapshot.empty) {
        throw new Error('No se encontró el usuario con ese rut');
      }
  
      // Obtener la referencia del primer documento que coincide con el rut
      const docRef = querySnapshot.docs[0].ref;
  
      // Actualizar los datos del usuario
      await docRef.update({
        Nombres: usuario.Nombres,
        Apellidos: usuario.Apellidos,
        Telefono: usuario.Telefono,
        Email: usuario.Email,
        rol: usuario.rol
      });
  
      console.log('Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;  // Re-lanzar el error para manejarlo en el lugar que se llame a esta función
    }
  }
  
  
  
  
  
  
  
  
  


  // Método para agregar un nuevo usuario
  agregarUsuario(usuario: any): Promise<void> {
    const id = this.firestore.createId(); // Crea un ID único para el nuevo usuario
    return this.firestore.collection('Usuario').doc(id).set(usuario);
  }

  eliminarProductoPorNombre(nombreProducto: string): Promise<void> {
    return this.firestore.collection('Productos', ref => ref.where('nombre', '==', nombreProducto))
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
          throw new Error('No se encontró ningun producto con ese nombre');
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


  // Método para subir imagen y obtener la URL
  subirImagen(imagen: File): Promise<string> {
    const filePath = `productos/${Date.now()}_${imagen.name}`; // Genera un nombre único para la imagen
    const storageRef = this.storage.ref(filePath);
    const uploadTask = storageRef.put(imagen); // Subir la imagen

    return new Promise<string>((resolve, reject) => {
      uploadTask.snapshotChanges().toPromise().then(() => {
        storageRef.getDownloadURL().toPromise().then(url => {
          resolve(url); // Retorna la URL de la imagen subida
        }).catch(reject); // En caso de error al obtener la URL
      }).catch(reject); // En caso de error al subir la imagen
    });
  }

  // Método para verificar si una categoría ya existe
  categoriaYaExiste(nombreCategoria: string): Promise<boolean> {
    const nombreEnMayusculas = nombreCategoria.toUpperCase();
    return this.firestore.collection('Categoria', ref =>
      ref.where('categoria', '==', nombreEnMayusculas)
    )
      .get()
      .toPromise()
      .then(snapshot => {
        if (snapshot && snapshot.docs) {
          return !snapshot.empty; // Devuelve true si existe, false si no.
        }
        return false; // Por defecto, considera que no existe.
      });
  }

  // Modificar la función productoYaExiste para aceptar el array de productos
  productoYaExiste(nombreProducto: string, productos: any[]): boolean {
    const nombreLimpio = nombreProducto.trim().toUpperCase(); // Normaliza el nombre recibido.

    // Compara si ya existe en el array de productos.
    return productos.some(producto => {
      const nombre = (producto.nombre || '').trim().toUpperCase(); // Normaliza el nombre de cada producto.
      return nombre === nombreLimpio; // Compara los nombres normalizados.
    });
  }

  async rutYaExiste(rut: string): Promise<boolean> {    
    const query = this.firestore
      .collection('Usuario', ref => ref.where('rut', '==', rut))
      .get();

    const snapshot = await firstValueFrom(query);
    return snapshot && !snapshot.empty; // Retorna `true` si se encontró al menos un documento.
  }

  // Método para actualizar el nombre de una categoría
  actualizarCategoriaPorNombre(nombreCategoria: string, nuevoNombre: string): Promise<void> {
    return this.firestore.collection('Categoria', ref => ref.where('categoria', '==', nombreCategoria))
      .get()
      .toPromise()
      .then(snapshot => {
        if (!snapshot || snapshot.empty) {
          throw new Error('No se encontró ninguna categoría con ese nombre');
        }
        // Obtener el id del primer documento encontrado
        const docRef = snapshot.docs[0].ref;
        return docRef.update({ categoria: nuevoNombre });  // Actualiza el nombre de la categoría
      })
      .catch((error) => {
        throw new Error('Error al actualizar la categoría: ' + error.message);
      });
  }


  // Método para actualizar el nombre de una categoría
  async actualizarProductoPorNombre(nombreProducto: string, actualizaciones: any): Promise<void> {
    const nombreLimpio = nombreProducto.trim();

    return this.firestore.collection('Productos', ref => ref.where('nombre', '==', nombreLimpio))
      .get()
      .toPromise()
      .then(snapshot => {
        if (!snapshot || snapshot.empty) {
          throw new Error(`No se encontró ningún producto con el nombre: ${nombreLimpio}`);
        }
        // Obtiene el ID del documento encontrado
        const docRef = snapshot.docs[0].ref;
        return docRef.update(actualizaciones); // Actualiza los campos especificados
      })
      .catch((error) => {
        console.error('Error al actualizar el producto:', error.message);
        throw new Error('Error al actualizar el producto: ' + error.message);
      });
  }



  getStorageRef(nombreArchivo: string) {
    const storage = getStorage(); // Obtén la instancia del almacenamiento
    return ref(storage, `productos/${nombreArchivo}`); // Crea una referencia con el nombre del archivo
  }






  // Método para verificar si una subcategoría existe en una categoría específica
  verificarSubCategoriaExistente(nombreCategoria: string, nombreSubCategoria: string): Promise<boolean> {
    const nombreCategoriaMayusculas = nombreCategoria.toUpperCase(); // Hacer la comparación insensible a mayúsculas
    const nombreSubCategoriaMayusculas = nombreSubCategoria.toUpperCase(); // Lo mismo para la subcategoría

    return this.firestore.collection('Categoria', ref =>
      ref.where('categoria', '==', nombreCategoriaMayusculas)
    )
      .get()
      .toPromise()
      .then(snapshot => {
        if (snapshot && !snapshot.empty) {  // Asegúrate de que snapshot no es undefined y tiene documentos
          const categoria = snapshot.docs[0].data() as any; // Asegúrate de que el tipo de 'categoria' sea 'any' o más específico
          const subcategorias: string[] = categoria['subcategorias'] || []; // Tipar explícitamente como un arreglo de strings

          // Verificar si la subcategoría existe en el arreglo de subcategorias
          return subcategorias.some((subcategoria: string) => subcategoria.toUpperCase() === nombreSubCategoriaMayusculas);
        }
        return false; // Si no se encuentra la categoría o si snapshot está vacío
      });
  }

  // Método para agregar una subcategoría a una categoría
  agregarSubCategoria(nombreCategoria: string, nombreSubCategoria: string): Promise<void> {
    const nombreCategoriaMayusculas = nombreCategoria.toUpperCase(); // Hacer la comparación insensible a mayúsculas
    const nombreSubCategoriaMayusculas = nombreSubCategoria.toUpperCase(); // Lo mismo para la subcategoría

    return this.firestore.collection('Categoria', ref =>
      ref.where('categoria', '==', nombreCategoriaMayusculas)
    )
      .get()
      .toPromise()
      .then(snapshot => {
        if (snapshot && !snapshot.empty) { // Verificar que snapshot tiene datos
          const categoriaDoc = snapshot.docs[0]; // Obtener el primer documento de la categoría
          const categoria = categoriaDoc.data() as any; // Obtener los datos de la categoría
          const subcategorias: string[] = categoria['subcategorias'] || []; // Asegurarse de que subcategorias es un arreglo

          // Verificar si la subcategoría ya existe
          if (subcategorias.some(subcategoria => subcategoria.toUpperCase() === nombreSubCategoriaMayusculas)) {
            throw new Error('La subcategoría ya existe en esta categoría.');
          }

          // Agregar la nueva subcategoría
          subcategorias.push(nombreSubCategoria);

          // Actualizar el documento de la categoría con la nueva subcategoría
          return categoriaDoc.ref.update({ subcategorias });
        } else {
          throw new Error('No se encontró la categoría con ese nombre.');
        }
      })
      .catch(error => {
        throw new Error('Error al agregar la subcategoría: ' + error.message);
      });
  }

  // Método para eliminar una subcategoría de una categoría
  eliminarSubCategoria(nombreCategoria: string, nombreSubCategoria: string): Promise<void> {
    const nombreCategoriaMayusculas = nombreCategoria.toUpperCase(); // Hacer la comparación insensible a mayúsculas
    const nombreSubCategoriaMayusculas = nombreSubCategoria.toUpperCase(); // Lo mismo para la subcategoría

    return this.firestore.collection('Categoria', ref =>
      ref.where('categoria', '==', nombreCategoriaMayusculas)
    )
      .get()
      .toPromise()
      .then(snapshot => {
        if (snapshot && !snapshot.empty) { // Verificar que snapshot tiene datos
          const categoriaDoc = snapshot.docs[0]; // Obtener el primer documento de la categoría
          const categoria = categoriaDoc.data() as any; // Obtener los datos de la categoría
          let subcategorias: string[] = categoria['subcategorias'] || []; // Asegurarse de que subcategorias es un arreglo

          // Verificar si la subcategoría existe en la lista
          const index = subcategorias.findIndex(subcategoria => subcategoria.toUpperCase() === nombreSubCategoriaMayusculas);
          if (index === -1) {
            throw new Error('La subcategoría no existe en esta categoría.');
          }

          // Eliminar la subcategoría de la lista
          subcategorias.splice(index, 1);

          // Actualizar el documento de la categoría con la nueva lista de subcategorías
          return categoriaDoc.ref.update({ subcategorias });
        } else {
          throw new Error('No se encontró la categoría con ese nombre.');
        }
      })
      .catch(error => {
        throw new Error('Error al eliminar la subcategoría: ' + error.message);
      });
  }


  // Método para actualizar el nombre de una subcategoría
  actualizarSubCategoria(nombreCategoria: string, subCategoriaActual: string, nuevoNombreSubCategoria: string): Promise<void> {
    const nombreCategoriaMayusculas = nombreCategoria.toUpperCase(); // Insensibilidad a mayúsculas
    const subCategoriaActualMayusculas = subCategoriaActual.toUpperCase();
    const nuevoNombreSubCategoriaMayusculas = nuevoNombreSubCategoria.toUpperCase();

    return this.firestore.collection('Categoria', ref =>
      ref.where('categoria', '==', nombreCategoriaMayusculas)
    )
      .get()
      .toPromise()
      .then(snapshot => {
        if (snapshot && !snapshot.empty) { // Verificar que snapshot tiene datos
          const categoriaDoc = snapshot.docs[0]; // Obtener el primer documento de la categoría
          const categoria = categoriaDoc.data() as any; // Obtener los datos de la categoría
          const subcategorias: string[] = categoria['subcategorias'] || []; // Asegurarse de que subcategorias es un arreglo

          // Encontrar el índice de la subcategoría actual
          const index = subcategorias.findIndex(subcategoria => subcategoria.toUpperCase() === subCategoriaActualMayusculas);
          if (index === -1) {
            throw new Error('La subcategoría no existe en esta categoría.');
          }

          // Verificar si el nuevo nombre ya existe
          if (subcategorias.some(subcategoria => subcategoria.toUpperCase() === nuevoNombreSubCategoriaMayusculas)) {
            throw new Error('Ya existe una subcategoría con el nuevo nombre.');
          }

          // Actualizar el nombre de la subcategoría
          subcategorias[index] = nuevoNombreSubCategoria;

          // Guardar los cambios en Firestore
          return categoriaDoc.ref.update({ subcategorias });
        } else {
          throw new Error('No se encontró la categoría con ese nombre.');
        }
      })
      .catch(error => {
        throw new Error('Error al actualizar la subcategoría: ' + error.message);
      });
  }

}