import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController, ToastController, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { BaseDatosService } from 'src/app/services/base-datos.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-menu-lista',
  templateUrl: './menu-lista.component.html',
  styleUrls: ['./menu-lista.component.scss'],
})
export class MenuListaComponent implements OnInit {
  @ViewChild('modalProducto') modalProducto!: IonModal;
  @ViewChild('modalCategoria') modalCategoria!: IonModal;
  @ViewChild('modalSubCategoria') modalSubCategoria!: IonModal;
  @ViewChild('modalCrearProducto') modalCrearProducto!: IonModal;
  @ViewChild('modalCrearCategoria') modalCrearCategoria!: IonModal;
  @ViewChild('modalCrearSubCategoria') modalCrearSubCategoria!: IonModal;

  // Mensaje por defecto para mostrar en los modales
  message = 'Este modal se abre cuando el botón es presionado.';

  // Variables para modificación de producto, categoría y subcategoría
  nombreCategoria = '';
  nombreSubCategoria: string = '';

  imagenActual: string = '';

  nombreProducto = '';
  descripcionProducto = '';
  precioPequenoProducto: number | null = null;
  precioGrandeProducto: number | null = null;
  estadoProducto: boolean | null = null;
  nuevoEstadoProducto: boolean | null = null; // Inicialmente null


  nuevaImagen: File | null = null; // Archivo seleccionado
  nuevaImagenPreview: string | null = null; // Vista previa de la imagen

  // Variables para creación de producto, categoría y subcategoría
  nombreNuevaCategoria = '';
  nombreNuevaSubCategoria: string = '';
  categoriaSeleccionada: string = "";
  nombreSubCategoriaSeleccionada: string = "";

  idCategoria: string = '';  // ID de la categoría a actualizar
  nuevoNombre: string = '';  // Nuevo nombre para la categoría
  nuevoNombreProducto: string = '';
  nuevaDescripcionProducto: string = '';
  nuevoPrecioPequenoProducto: number | null = null;
  nuevoPrecioGrandeProducto: number | null = null;
  nuevasubcategoriaSeleccionada: string = '';

  catSeleccionada: any;
  subcategoriaSeleccionada: any;

  crearImagen: any;
  crearNombreProducto: any;
  crearDescripcionProducto: any;
  crearPrecioPequenoProducto: any;
  crearPrecioGrandeProducto: any;
  crearEstadoProducto: any;
  crearCategoria: any;



  subcategoriaOriginal: string | null = null;


  subcategorias: any[] = [];


  // Lista de categorías para mostrar en el componente
  categorias: any[] = [];
  productos: any[] = [];

  constructor(
    private alertController: AlertController,
    private baseDatosService: BaseDatosService,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.subcategoriaOriginal = this.subcategoriaSeleccionada;
    // Cargar las categorías desde la base de datos al inicializar el componente
    this.baseDatosService.obtenerCategorias().subscribe((data) => {
      this.categorias = data;
    });

    // Cargar los productos desde la base de datos al inicializar el componente
    this.baseDatosService.obtenerProductos().subscribe((data) => {
      this.productos = data;
    });


  }

  // Cerrar el modal específico
  cancel(modalType: string) {
    switch (modalType) {
      case 'producto':
        this.nuevoNombreProducto = '';
        this.nuevaImagen = null;
        this.nuevaDescripcionProducto = '';
        this.nuevoPrecioPequenoProducto = null;
        this.nuevoPrecioGrandeProducto = null;
        this.catSeleccionada = null;
        this.subcategoriaSeleccionada = null;
        this.nuevaImagenPreview = null;
        this.modalProducto.dismiss(null, 'cancel');
        break;
      case 'categoria':
        this.modalCategoria.dismiss(null, 'cancel');
        this.nuevoNombre = '';
        break;
      case 'subCategoria':
        this.modalSubCategoria.dismiss(null, 'cancel');
        this.nombreNuevaSubCategoria = '';
        break;
      case 'crearProducto':
        this.modalCrearProducto.dismiss(null, 'cancel');
        this.crearNombreProducto = null;
        this.crearDescripcionProducto = null;
        this.crearPrecioPequenoProducto = null;
        this.crearPrecioGrandeProducto = null;
        this.crearEstadoProducto = null;
        this.crearCategoria = null;
        this.catSeleccionada = null;

        break;
      case 'crearCategoria':
        this.modalCrearCategoria.dismiss(null, 'cancel');
        this.nombreNuevaCategoria = '';
        break;
      case 'crearSubCategoria':
        this.modalCrearSubCategoria.dismiss(null, 'cancel');
        break;
    }
  }

  // Guardar los cambios y cerrar el modal correspondiente
  confirm(modalType: string) {
    switch (modalType) {
      case 'producto':
        this.modalProducto.dismiss(
          {
            nombreProducto: this.nombreProducto,
          },
          'confirm'
        );
        break;
      case 'categoria':
        this.modalCategoria.dismiss(
          {
            nombreCategoria: this.nombreCategoria,
          },
          'confirm'
        );
        break;
      case 'subCategoria':
        this.modalSubCategoria.dismiss(
          {
            nombreSubCategoriaSeleccionada: this.nombreSubCategoria,
          },
          'confirm'
        );
        break;
      // Función para verificar si el nombre del producto ya existe antes de crear un nuevo producto
      case 'crearProducto':
        // Verifica que los campos no estén vacíos
        if (!this.verificarCamposVacios()) {
          return; // Detiene el proceso si algún campo está vacío
        }

        // Verifica si el nombre del producto ya existe
        const nombreProductoNormalizado = this.crearNombreProducto.trim().toUpperCase(); // Normaliza el nombre del producto a mayúsculas
        this.baseDatosService.obtenerProductos().subscribe((productos) => {
          const productoExistente = this.baseDatosService.productoYaExiste(nombreProductoNormalizado, productos);

          if (productoExistente) {
            this.presentToast('Ya existe un producto con este nombre.');
          } else {
            // Si el producto no existe, procede a crear el nuevo producto
            this.modalCrearProducto.dismiss(
              {
                nombreProducto: this.crearNombreProducto,
                descripcionProducto: this.crearDescripcionProducto,
                precioPequenoProducto: this.crearPrecioPequenoProducto,
                precioGrandeProducto: this.crearPrecioGrandeProducto,
                estadoProducto: this.crearEstadoProducto,
                categoria: this.crearCategoria,
              },
              'confirm'
            );
          }
        });
        break;



      case 'crearCategoria':
        const nombreValidado = this.nombreNuevaCategoria.trim(); // Elimina espacios al inicio y al final

        if (!nombreValidado) {  // Verifica que no esté vacío
          this.presentToast('El nombre de la categoría no puede estar vacío ni contener solo espacios.');
          return;
        }

        const nombreEnMayusculas = nombreValidado.toUpperCase(); // Convierte a mayúsculas para la validación

        // Verifica si la categoría ya existe
        this.baseDatosService.categoriaYaExiste(nombreEnMayusculas)
          .then(existe => {
            if (existe) {
              this.presentToast('Ya existe una categoría con este nombre.');
            } else {
              // Si no existe, agregar la categoría
              this.baseDatosService.agregarCategoria({ categoria: nombreEnMayusculas })
                .then(() => {
                  this.presentToast('Categoría creada correctamente.');
                  this.modalCrearCategoria.dismiss(
                    { nombreNuevaCategoria: nombreValidado },
                    'confirm'
                  );

                  // Actualizar la lista de categorías después de agregar una nueva
                  this.baseDatosService.obtenerCategorias().subscribe(data => {
                    this.categorias = data;
                  });
                })
                .catch(error => {
                  console.error('Error al crear categoría', error);
                  this.presentToast('Error al crear la categoría.');
                });
            }
          })
          .catch(error => {
            console.error('Error al validar categoría', error);
            this.presentToast('Error al validar la categoría.');
          })
          .finally(() => {
            this.nombreNuevaCategoria = "";
          })
        break;
      case 'crearSubCategoria':
        // Validaciones
        if (!this.categoriaSeleccionada.trim()) {
          this.presentToast('Debe escoger una Categoria');
          return;
        } else if (!this.nombreNuevaSubCategoria.trim()) {
          this.presentToast('El nombre de la nueva Subcategoría no puede estar vacío.');
          return;
        }
        // Verificar si la subcategoría ya existe
        this.baseDatosService.verificarSubCategoriaExistente(this.categoriaSeleccionada, this.nombreNuevaSubCategoria)
          .then(existe => {
            if (existe) {
              this.presentToast('La subcategoría ya existe en esta categoría.');

            } else {
              // Si no existe, podemos proceder a agregarla              
              this.agregarSubCategoria();
            }
          })
          .catch(error => {
            this.presentToast('Error al verificar la subcategoría: ' + error.message);
          }).finally(() => {
            this.nombreNuevaSubCategoria = "";
          })
    }
  }

  verificarCamposVacios(): boolean {
    // Validación de la imagen
    if (!this.crearImagen) {
      this.presentToast('La imagen es obligatoria.');
      return false;
    }

    // Validación del nombre del producto
    if (!this.crearNombreProducto || !this.crearNombreProducto.trim()) {
      this.presentToast('El nombre del producto es obligatorio.');
      return false;
    }

    // Validación de la descripción del producto
    if (!this.crearDescripcionProducto || !this.crearDescripcionProducto.trim()) {
      this.presentToast('La descripción del producto es obligatoria.');
      return false;
    }

    // Validación de los precios
    const precioPequeno = parseFloat(this.crearPrecioPequenoProducto); // Convierte el precio pequeño a número
    const precioGrande = parseFloat(this.crearPrecioGrandeProducto); // Convierte el precio grande a número

    if (isNaN(precioPequeno) || precioPequeno <= 0) {
      this.presentToast('El precio pequeño debe ser un número mayor a 0.');
      return false;
    }

    if (isNaN(precioGrande) || precioGrande <= 0) {
      this.presentToast('El precio grande debe ser un número mayor a 0.');
      return false;
    }

    // Validación del estado (booleano)
    if (this.crearEstadoProducto === null || this.crearEstadoProducto === undefined) {
      this.presentToast('Debe seleccionar un estado para el producto.');
      return false;
    }

    // Validación de la categoría
    if (!this.crearCategoria || !this.crearCategoria.trim()) {
      this.presentToast('Debe seleccionar una categoría.');
      return false;
    }

    // Si todos los campos están completos, devuelve true
    this.presentToast('Todos los campos están correctamente llenos.');
    return true;
  }




  // Lógica para agregar la subcategoría
  agregarSubCategoria() {
    console.log("Agregando subcategoría...");

    this.baseDatosService.agregarSubCategoria(this.categoriaSeleccionada, this.nombreNuevaSubCategoria)
      .then(() => {
        this.presentToast('Subcategoría agregada correctamente.');
        this.modalCrearSubCategoria.dismiss(null, 'confirm')
      })
      .catch(error => {
        this.presentToast('Error al agregar la subcategoría: ' + error.message);
      });
  }

  async actualizarProducto() {
    if (
      (!this.nuevoNombreProducto || !this.nuevoNombreProducto.trim()) &&
      !this.nuevaImagen &&
      (!this.nuevaDescripcionProducto || !this.nuevaDescripcionProducto.trim()) &&
      (this.nuevoPrecioPequenoProducto === null || this.nuevoPrecioPequenoProducto === this.precioPequenoProducto) &&
      (this.nuevoPrecioGrandeProducto === null || this.nuevoPrecioGrandeProducto === this.precioGrandeProducto) &&
      (this.nuevoEstadoProducto === null || this.nuevoEstadoProducto === this.estadoProducto) &&
      (this.subcategoriaSeleccionada === null || this.subcategoriaSeleccionada === this.subcategoriaOriginal)
    ) {
      this.presentToast('Tienes que hacer al menos un cambio para guardar.');
      return;
    }

    const nuevoNombreLimpio = this.nuevoNombreProducto?.trim();
    const nombreActualLimpio = this.nombreProducto?.trim();

    const nuevoEstadoProducto = this.nuevoEstadoProducto;
    const subcategoriaSeleccionadaLimpia = this.subcategoriaSeleccionada?.trim();
    const subcategoriaOriginalLimpia = this.subcategoriaOriginal?.trim();

    const nuevoNombreLimpioMAYUS = this.nuevoNombreProducto?.trim().toUpperCase();
    const nombreActualLimpioMAYUS = this.nombreProducto?.trim().toUpperCase();

    // Verifica si el nombre nuevo es igual al actual
    if (nuevoNombreLimpio === nombreActualLimpio || nuevoNombreLimpioMAYUS === nombreActualLimpioMAYUS) {
      this.presentToast('El nombre del producto es el mismo.');
      return;
    }

    // Verifica si ya existe un producto con el nuevo nombre
    const existe = this.baseDatosService.productoYaExiste(nuevoNombreLimpio, this.productos);
    if (existe) {
      this.presentToast('Ya existe un producto con este nombre.');
      return;
    }

    // Si se ha actualizado la imagen, sube la imagen y obtiene la URL
    let urlImagen = this.imagenActual; // Mantén la imagen actual si no se selecciona una nueva imagen
    if (this.nuevaImagen) {
      urlImagen = await this.baseDatosService.subirImagen(this.nuevaImagen); // Sube la imagen y obtiene la URL
    }

    // Actualiza el producto en la base de datos
    const actualizaciones: any = {};
    if (nuevoNombreLimpio && nuevoNombreLimpio !== nombreActualLimpio) {
      actualizaciones.nombre = nuevoNombreLimpio; // Actualiza el nombre si es diferente
    }

    if (this.nuevaDescripcionProducto && this.nuevaDescripcionProducto !== this.descripcionProducto) {
      actualizaciones.descripcion = this.nuevaDescripcionProducto.trim(); // Actualiza la descripción si es diferente
    }

    // Verifica y actualiza el precio pequeño si es válido
    if (typeof this.nuevoPrecioPequenoProducto === 'number' && this.nuevoPrecioPequenoProducto !== this.precioPequenoProducto) {
      actualizaciones.precioPequeno = this.nuevoPrecioPequenoProducto;
    }

    // Verifica y actualiza el precio grande si es válido
    if (typeof this.nuevoPrecioGrandeProducto === 'number' && this.nuevoPrecioGrandeProducto !== this.precioGrandeProducto) {
      actualizaciones.precioGrande = this.nuevoPrecioGrandeProducto;
    }

    if (this.nuevoEstadoProducto !== null && this.nuevoEstadoProducto !== this.estadoProducto) {
      actualizaciones.disponible = this.nuevoEstadoProducto; // Actualiza el estado si es diferente
    }

    // Si se seleccionó una nueva subcategoría, actualiza el campo correspondiente
    if (this.subcategoriaSeleccionada && this.subcategoriaSeleccionada !== this.subcategoriaOriginal) {
      actualizaciones.categoria = this.subcategoriaSeleccionada; // Actualiza la subcategoría seleccionada
    }

    if (urlImagen) {
      actualizaciones.imagen = urlImagen; // Actualiza la imagen si se ha subido una nueva imagen
    }

    try {
      await this.baseDatosService.actualizarProductoPorNombre(nombreActualLimpio, actualizaciones);
      this.presentToast('Producto actualizado correctamente.');

      // Restablecer los campos
      this.nuevoNombreProducto = '';
      this.nuevaDescripcionProducto = '';
      this.nuevaImagen = null;
      this.nuevoPrecioPequenoProducto = null;
      this.nuevoPrecioGrandeProducto = null;
      this.nuevoEstadoProducto = null;
      this.catSeleccionada = null;
      this.subcategoriaSeleccionada = null; // Restablecer la subcategoría
      this.modalController.dismiss(); // Cierra el modal
    } catch (error: any) {
      console.error('Error al actualizar el producto:', error.message);
      this.presentToast('Error al actualizar el producto.');
    }
  }



  // Método para subir una imagen
  async subirImagen(imagen: File): Promise<string> {
    try {
      const storage = getStorage(); // Obtén la instancia de almacenamiento
      const storageRef = ref(storage, `productos/${imagen.name}`); // Crea una referencia en el almacenamiento

      // Subir la imagen usando uploadBytes
      const snapshot = await uploadBytes(storageRef, imagen);
      console.log('Imagen subida:', snapshot);

      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error: any) {
      console.error('Error al subir la imagen:', error);
      throw new Error('No se pudo subir la imagen');
    }
  }







  // Método para actualizar la categoría
  actualizarCategoria() {
    // Validación básica
    if (!this.nuevoNombre.trim()) {
      this.presentToast('El nombre de la categoría no puede estar vacío.');
      return;
    }

    this.baseDatosService.categoriaYaExiste(this.nuevoNombre)
      .then(existe => {
        if (existe) {
          this.presentToast('Ya existe una categoria con este nombre.');
        } else {
          this.baseDatosService.actualizarCategoriaPorNombre(this.nombreCategoria, this.nuevoNombre.trim())
            .then(() => {
              console.log('Categoría actualizada con éxito');
              this.presentToast('Categoría actualizada correctamente');

              // Cerrar el modal
              this.modalController.dismiss();

              // Actualizar la lista de categorías
              this.baseDatosService.obtenerCategorias().subscribe(data => {
                this.categorias = data;
              });
            })
            .catch((error) => {
              console.error('Error al actualizar la categoría', error);
              this.presentToast('Hubo un error al actualizar la categoría.');
            });
        }
      })
  }

  actualizarSubCategoria(categoriaSeleccionada: string, nuevoNombreSubCategoria: string) {

    // Validación básica
    if (!categoriaSeleccionada.trim() || !nuevoNombreSubCategoria.trim()) {
      this.presentToast('Debe completar todos los campos.');
      return;
    }

    // Llama al método del servicio para actualizar la subcategoría
    this.baseDatosService.actualizarSubCategoria(
      this.categoriaSeleccionada,
      this.nombreSubCategoriaSeleccionada,
      nuevoNombreSubCategoria.trim()
    )
      .then(() => {
        console.log('Subcategoría actualizada con éxito');
        this.presentToast('Subcategoría actualizada correctamente.');

        // Cerrar el modal
        this.modalController.dismiss();

        // Actualizar la lista de categorías para reflejar los cambios
        this.baseDatosService.obtenerCategorias().subscribe(data => {
          this.categorias = data;
        });
      })
      .catch(error => {
        console.error('Error al actualizar la subcategoría:', error);
        this.presentToast('Hubo un error al actualizar la subcategoría.');
      });
  }







  // Eliminar acción con confirmación en el modal específico
  async delete(modalType: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro que deseas eliminar este ${modalType === 'producto' ? 'Producto' : modalType === 'categoria' ? 'Categoría' : 'SubCategoría'
        }?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            switch (modalType) {
              case 'producto':
                this.eliminarProducto();
                break;
              case 'categoria':
                this.eliminarCategoria();
                break;
              case 'subCategoria':
                this.eliminarSubCategoria();
                break;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Acción para eliminar el producto
  eliminarProducto() {
    if (this.nombreProducto) {
      try {
        this.baseDatosService.eliminarProductoPorNombre(this.nombreProducto);
        this.presentToast('Producto eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        this.presentToast('Error al eliminar el producto');
      }
    }
    this.modalProducto.dismiss(null, 'eliminar');
  }

  // Acción para eliminar la categoría
  eliminarCategoria() {
    if (this.nombreCategoria) {
      try {
        this.baseDatosService.eliminarCategoriaPorNombre(this.nombreCategoria);
        this.presentToast('Categoría eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        this.presentToast('Error al eliminar la categoría');
      }
    }
    this.modalCategoria.dismiss(null, 'eliminar');
    this.nombreNuevaCategoria = ''; // Limpia el campo
  }

  // Mostrar un mensaje emergente (toast) con un mensaje específico
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  // Eliminar la subcategoría seleccionada
  eliminarSubCategoria() {
    console.log("Eliminando subcategoría...");

    // Asegúrate de que ambas variables tengan valores
    if (!this.categoriaSeleccionada.trim() || !this.nombreSubCategoriaSeleccionada.trim()) {
      this.presentToast('Debe seleccionar una categoría y una subcategoría.');
      return;
    }

    // Llamamos al servicio para eliminar la subcategoría en Firestore
    this.baseDatosService.eliminarSubCategoria(this.categoriaSeleccionada, this.nombreSubCategoriaSeleccionada)
      .then(() => {
        this.presentToast('Subcategoría eliminada correctamente.');
        // Después de eliminar, podemos actualizar la lista de subcategorías si es necesario
        this.baseDatosService.obtenerCategorias().subscribe((data) => {
          this.categorias = data;
        });

        // Cerrar el modal después de eliminar
        this.modalSubCategoria.dismiss(null, 'eliminar');
      })
      .catch(error => {
        this.presentToast('Error al eliminar la subcategoría: ' + error.message);
      });
  }



  // Manejar el cierre de los modales, mostrando el mensaje adecuado
  onWillDismiss(event: Event, modalType: string) {
    const ev = event as CustomEvent<OverlayEventDetail<any>>;
    if (ev.detail.role === 'confirm') {
      const data = ev.detail.data;
      if (modalType === 'producto' && data) {
        this.message = `Producto guardado: ${data.nombreProducto}, ${data.valorProducto}`;
      } else if (modalType === 'categoria' && data) {
        this.message = `Categoría guardada: ${data.nombreCategoria}`;
      } else if (modalType === 'subCategoria' && data) {
        this.message = `SubCategoría guardada: ${data.nombreSubCategoria}`;
      } else if (modalType === 'crearProducto' && data) {
        this.message = `Producto creado: ${data.nombreNuevoProducto}, ${data.valorNuevoProducto}`;
      } else if (modalType === 'crearCategoria' && data) {
        this.message = `Categoría creada: ${data.nombreNuevaCategoria}`;
        this.baseDatosService.obtenerCategorias().subscribe((data) => {
          this.categorias = data;
        });
      } else if (modalType === 'crearSubCategoria' && data) {
        this.message = `SubCategoría creada: ${data.nombreNuevaSubCategoria}`;
      }
    } else if (ev.detail.role === 'eliminar') {
      this.message = `${modalType === 'producto' ? 'Producto' : modalType === 'categoria' ? 'Categoría' : 'SubCategoría'} eliminado.`;
    }
  }

  // Abre el modal correspondiente según el tipo de elemento (producto, categoría, subcategoría)

  openModal(tipo: string, item: any) {

    if (tipo === 'categoria') {
      this.nombreCategoria = item.categoria; // Asignar el nombre de la categoría seleccionada    
      this.modalCategoria.present(); // Muestra el modal de categoría
    } else if (tipo === 'subCategoria') {
      this.nombreSubCategoria = item.subcategoria;  // Asignar el nombre de la subcategoría seleccionada
      this.nombreSubCategoriaSeleccionada = item.subcategoria;  // Asignar también al campo específico
      this.categoriaSeleccionada = item.categoria;        // Asignar la categoría correspondiente
      this.modalSubCategoria.present();                  // Muestra el modal de subcategoría
    } else if (tipo === 'producto') {
      this.nombreProducto = item.nombre;
      this.descripcionProducto = item.descripcion;
      this.precioPequenoProducto = item.precioPequeno;
      this.precioGrandeProducto = item.precioGrande;
      this.estadoProducto = item.disponible;
      this.modalProducto.present();
    }
  }

  getProductosPorSubcategoria(subcategoria: string) {
    return this.productos.filter(producto => {
      const categoriaProducto = producto.categoria ? producto.categoria.toString().toLowerCase() : '';
      return categoriaProducto === subcategoria.toLowerCase();
    });
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.crearImagen = input.files[0]; // Almacena la imagen seleccionada
      this.nuevaImagen = input.files[0]; // También actualiza nuevaImagen si lo necesitas en otro lugar

      const reader = new FileReader();
      reader.onload = () => {
        this.nuevaImagenPreview = reader.result as string; // Previsualiza la imagen
      };
      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
        this.presentToast('Error al procesar la imagen seleccionada.');
      };
      reader.readAsDataURL(this.crearImagen); // Lee la imagen seleccionada
    }
  }




  // Método para actualizar las subcategorías cuando se selecciona una categoría
  cargarSubcategorias() {
    if (this.catSeleccionada) {
      this.subcategorias = this.catSeleccionada.subcategorias;
      this.subcategoriaSeleccionada = null; // Reinicia la subcategoría seleccionada
    }
  }

}
