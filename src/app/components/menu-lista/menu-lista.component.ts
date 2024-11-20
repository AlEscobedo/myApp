import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController, ToastController, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { BaseDatosService } from 'src/app/services/base-datos.service';

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

  // Variables para creación de producto, categoría y subcategoría
  nombreNuevaCategoria = '';
  nombreNuevaSubCategoria: string = '';
  categoriaSeleccionada: string = "";
  nombreSubCategoriaSeleccionada: string = "";

  idCategoria: string = '';  // ID de la categoría a actualizar
  nuevoNombre: string = '';  // Nuevo nombre para la categoría

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
            // agregar codigo
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
      case 'crearProducto':
        this.modalCrearProducto.dismiss(
          {
            // agregar codigo
          },
          'confirm'
        );
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
        console.log("Se llamó a la función crear Subcategoria, pasaste los siguientes datos: " + this.categoriaSeleccionada + ' y ' + this.nombreNuevaSubCategoria);
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
              console.log("PASASTE A PODER CREARLA BROu")
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
    console.log("Categoría seleccionada:", categoriaSeleccionada);
    console.log("Nuevo nombre de la subcategoría:", nuevoNombreSubCategoria);

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
    console.log('Producto eliminado');
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
      console.log('Datos recibidos:', item);
      this.nombreSubCategoria = item.subcategoria;  // Asignar el nombre de la subcategoría seleccionada
      this.nombreSubCategoriaSeleccionada = item.subcategoria;  // Asignar también al campo específico
      this.categoriaSeleccionada = item.categoria;        // Asignar la categoría correspondiente
      this.modalSubCategoria.present();                  // Muestra el modal de subcategoría
    }
  }

  // Agregamos un nuevo método en el componente para filtrar productos según la subcategoría
  getProductosPorSubcategoria(subcategoria: string) {
    // Filtramos los productos comparando las categorías en minúsculas
    return this.productos.filter(producto => {
      const categoriaProducto = producto.categoria.toLowerCase(); // Asegúrate de que la categoría esté en minúsculas
      return categoriaProducto === subcategoria.toLowerCase(); // Compara con la subcategoría en minúsculas
    });
  }



}
