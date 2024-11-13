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
  nombreProducto = '';
  descripcionProducto = '';
  valorProducto = '';
  nombreCategoria = '';
  nombreSubCategoria = '';
  descripcionSubCategoria = '';

  // Variables para creación de producto, categoría y subcategoría
  nombreNuevoProducto = '';
  descripcionNuevoProducto = '';
  valorNuevoProducto = '';
  nombreNuevaCategoria = '';
  nombreNuevaSubCategoria = '';
  descripcionNuevaSubCategoria = '';

  idCategoria: string = '';  // ID de la categoría a actualizar
  nuevoNombre: string = '';  // Nuevo nombre para la categoría

  // Lista de categorías para mostrar en el componente
  categorias: any[] = [];

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
  }

  // Cerrar el modal específico
  cancel(modalType: string) {
    switch (modalType) {
      case 'producto':
        this.modalProducto.dismiss(null, 'cancel');
        break;
      case 'categoria':
        this.modalCategoria.dismiss(null, 'cancel');
        break;
      case 'subCategoria':
        this.modalSubCategoria.dismiss(null, 'cancel');
        break;
      case 'crearProducto':
        this.modalCrearProducto.dismiss(null, 'cancel');
        break;
      case 'crearCategoria':
        this.modalCrearCategoria.dismiss(null, 'cancel');
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
            descripcionProducto: this.descripcionProducto,
            valorProducto: this.valorProducto,
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
            nombreSubCategoria: this.nombreSubCategoria,
            descripcionSubCategoria: this.descripcionSubCategoria,
          },
          'confirm'
        );
        break;
      case 'crearProducto':
        this.modalCrearProducto.dismiss(
          {
            nombreNuevoProducto: this.nombreNuevoProducto,
            descripcionNuevoProducto: this.descripcionNuevoProducto,
            valorNuevoProducto: this.valorNuevoProducto,
          },
          'confirm'
        );
        break;
      case 'crearCategoria':
        this.baseDatosService
          .agregarCategoria({ categoria: this.nombreNuevaCategoria })
          .then((response) => {
            console.log('Categoría creada', response);
            this.modalCrearCategoria.dismiss(
              { nombreNuevaCategoria: this.nombreNuevaCategoria },
              'confirm'
            );
            // Actualizar la lista de categorías después de agregar una nueva
            this.baseDatosService.obtenerCategorias().subscribe((data) => {
              this.categorias = data;
            });
          })
          .catch((error) => {
            console.error('Error al crear categoría', error);
          });
        break;
      case 'crearSubCategoria':
        this.modalCrearSubCategoria.dismiss(
          {
            nombreNuevaSubCategoria: this.nombreNuevaSubCategoria,
            descripcionNuevaSubCategoria: this.descripcionNuevaSubCategoria,
          },
          'confirm'
        );
        break;
    }
  }

  // Método para actualizar la categoría
  actualizarCategoria() {
    console.log('Nombre de categoría a actualizar:', this.nombreCategoria);
    console.log('Nuevo nombre de categoría:', this.nuevoNombre);
  
    if (!this.nombreCategoria || !this.nuevoNombre) {
      console.error('Nombre de categoría o nuevo nombre no válidos');
      return;
    }
  
    this.baseDatosService.actualizarCategoriaPorNombre(this.nombreCategoria, this.nuevoNombre)
      .then(() => {
        console.log('Categoría actualizada con éxito');
        this.presentToast('Categoría actualizada correctamente');
        
        // Cerrar el modal
        this.modalController.dismiss();  // Esto cerrará el modal
        
        // Opcionalmente, puedes mostrar un mensaje de éxito (toast o alert)
      })
      .catch((error) => {
        console.error('Error al actualizar la categoría', error);
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

  // Acción para eliminar la subcategoría
  eliminarSubCategoria() {
    console.log('SubCategoría eliminada');
    this.modalSubCategoria.dismiss(null, 'eliminar');
  }

  // Manejar el cierre de los modales, mostrando el mensaje adecuado
  onWillDismiss(event: Event, modalType: string) {
    const ev = event as CustomEvent<OverlayEventDetail<any>>;
    if (ev.detail.role === 'confirm') {
      const data = ev.detail.data;
      if (modalType === 'producto' && data) {
        this.message = `Producto guardado: ${data.nombreProducto}, ${data.descripcionProducto}, ${data.valorProducto}`;
      } else if (modalType === 'categoria' && data) {
        this.message = `Categoría guardada: ${data.nombreCategoria}`;
      } else if (modalType === 'subCategoria' && data) {
        this.message = `SubCategoría guardada: ${data.nombreSubCategoria}, ${data.descripcionSubCategoria}`;
      } else if (modalType === 'crearProducto' && data) {
        this.message = `Producto creado: ${data.nombreNuevoProducto}, ${data.descripcionNuevoProducto}, ${data.valorNuevoProducto}`;
      } else if (modalType === 'crearCategoria' && data) {
        this.message = `Categoría creada: ${data.nombreNuevaCategoria}`;
        this.baseDatosService.obtenerCategorias().subscribe((data) => {
          this.categorias = data;
        });
      } else if (modalType === 'crearSubCategoria' && data) {
        this.message = `SubCategoría creada: ${data.nombreNuevaSubCategoria}, ${data.descripcionNuevaSubCategoria}`;
      }
    } else if (ev.detail.role === 'eliminar') {
      this.message = `${modalType === 'producto' ? 'Producto' : modalType === 'categoria' ? 'Categoría' : 'SubCategoría'} eliminado.`;
    }
  }

  // Abre el modal correspondiente según el tipo de elemento (producto, categoría, subcategoría)
  openModal(type: string, item: any) {
    switch (type) {
      case 'producto':
        this.nombreProducto = item.nombre;
        this.descripcionProducto = item.descripcion;
        this.valorProducto = item.precio;
        this.modalProducto.present();
        break;
      case 'categoria':
        this.nombreCategoria = item.categoria;
        this.modalCategoria.present();
        break;
      case 'subCategoria':
        this.nombreSubCategoria = item.nombre;
        this.descripcionSubCategoria = item.descripcion;
        this.modalSubCategoria.present();
        break;
    }
  }
}
