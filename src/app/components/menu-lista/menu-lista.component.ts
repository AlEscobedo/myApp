import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController, ToastController } from '@ionic/angular';
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

  message = 'Este modal se abre cuando el botón es presionado.';

  // Variables para modificación de producto y categoría
  nombreProducto: string = "";
  descripcionProducto: string = "";
  valorProducto: string = "";

  nombreCategoria: string = "";
  //descripcionCategoria: string = "";

  nombreSubCategoria: string = "";
  descripcionSubCategoria: string = "";

  // Variables para creación de producto y categoría
  nombreNuevoProducto: string = "";
  descripcionNuevoProducto: string = "";
  valorNuevoProducto: string = "";

  nombreNuevaCategoria: string = "";
  //descripcionNuevaCategoria: string = "";

  nombreNuevaSubCategoria: string = "";
  descripcionNuevaSubCategoria: string = "";

  constructor(private alertController: AlertController, private baseDatosService: BaseDatosService, private toastController: ToastController) { }

  categorias: any[] = [];
  ngOnInit() {
    this.baseDatosService.obtenerCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  // Cerrar el modal específico
  cancel(modalType: string) {
    if (modalType === 'producto') {
      this.modalProducto.dismiss(null, 'cancel');
    } else if (modalType === 'categoria') {
      this.modalCategoria.dismiss(null, 'cancel');
    } else if (modalType === 'subCategoria') {
      this.modalSubCategoria.dismiss(null, 'cancel');
    } else if (modalType === 'crearProducto') {
      this.modalCrearProducto.dismiss(null, 'cancel');
    } else if (modalType === 'crearCategoria') {
      this.modalCrearCategoria.dismiss(null, 'cancel');
    } else if (modalType === 'crearSubCategoria') {
      this.modalCrearSubCategoria.dismiss(null, 'cancel');
    }
  }

  // Guardar cambios en el modal específico
  confirm(modalType: string) {
    if (modalType === 'producto') {
      this.modalProducto.dismiss({
        nombreProducto: this.nombreProducto,
        descripcionProducto: this.descripcionProducto,
        valorProducto: this.valorProducto,
      }, 'confirm');
    } else if (modalType === 'categoria') {
      this.modalCategoria.dismiss({
        nombreCategoria: this.nombreCategoria,
        //descripcionCategoria: this.descripcionCategoria,
      }, 'confirm');
    } else if (modalType === 'subCategoria') {
      this.modalSubCategoria.dismiss({
        nombreSubCategoria: this.nombreSubCategoria,
        descripcionSubCategoria: this.descripcionSubCategoria,
      }, 'confirm');
    }
    else if (modalType === 'crearProducto') {
      this.modalCrearProducto.dismiss({
        nombreNuevoProducto: this.nombreNuevoProducto,
        descripcionNuevoProducto: this.descripcionNuevoProducto,
        valorNuevoProducto: this.valorNuevoProducto,
      }, 'confirm');

    } else if (modalType === 'crearCategoria') {
      this.baseDatosService.agregarCategoria({
        categoria: this.nombreNuevaCategoria,
      }).then((response) => {
        console.log('Categoría creada', response);
        this.modalCrearCategoria.dismiss({
          nombreNuevaCategoria: this.nombreNuevaCategoria
        }, 'confirm');
        // Actualizar la lista de categorías después de agregar una nueva
        this.baseDatosService.obtenerCategorias().subscribe(data => {
          this.categorias = data;
        });
      }).catch((error) => {
        console.error('Error al crear categoría', error);
      });

    } else if (modalType === 'crearSubCategoria') {
      this.modalCrearSubCategoria.dismiss({
        nombreNuevaSubCategoria: this.nombreNuevaSubCategoria,
        descripcionNuevaSubCategoria: this.descripcionNuevaSubCategoria,
      }, 'confirm');
    }
  }

  // Eliminar acción con confirmación en el modal específico
  async delete(modalType: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro que deseas eliminar este ${modalType === 'producto' ? 'Producto' : modalType === 'categoria' ? 'Categoria' : 'SubCategoría'}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            if (modalType === 'producto') {
              this.eliminarProducto();
            } else if (modalType === 'categoria') {
              this.eliminarCategoria();
            } else if (modalType === 'subCategoria') {
              this.eliminarSubCategoria();
            }
          }
        }
      ]
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
    console.log('Categoría eliminada');
    this.modalCategoria.dismiss(null, 'eliminar');
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }


  // Acción para eliminar la SubCategoría
  eliminarSubCategoria() {
    console.log('SubCategoría eliminada');
    this.modalSubCategoria.dismiss(null, 'eliminar');
  }

  // Manejar el cierre de los modales
  onWillDismiss(event: Event, modalType: string) {
    const ev = event as CustomEvent<OverlayEventDetail<any>>;
    if (ev.detail.role === 'confirm') {
      const data = ev.detail.data;
      if (modalType === 'producto' && data) {
        this.message = `Producto guardado: ${data.nombreProducto}, ${data.descripcionProducto}, ${data.valorProducto}`;
      } else if (modalType === 'categoria' && data) {
        this.message = `Categoría guardada: ${data.nombreCategoria}, ${data.descripcionCategoria}`;
      } else if (modalType === 'subCategoria' && data) {
        this.message = `Sub Categoría guardada: ${data.nombreSubCategoria}, ${data.descripcionSubCategoria}`;
      } else if (modalType === 'crearProducto' && data) {
        this.message = `Producto creado: ${data.nombreNuevoProducto}, ${data.descripcionNuevoProducto}, ${data.valorNuevoProducto}`;
      } else if (modalType === 'crearCategoria' && data) {
        this.message = `Categoría creada: ${data.nombreNuevaCategoria}`;
        this.baseDatosService.obtenerCategorias().subscribe(data => {
          this.categorias = data;
        });
      } else if (modalType === 'crearSubCategoria' && data) {
        this.message = `SubCategoría creada: ${data.nombreNuevaSubCategoria}, ${data.descripcionNuevaSubCategoria}`;
      }
    } else if (ev.detail.role === 'eliminar') {
      this.message = `${modalType === 'producto' ? 'Producto' : modalType === 'categoria' ? 'Categoría' : 'SubCategoría'} eliminado.`;
    }
  }

  openModal(type: string, item: any) {
    if (type === 'producto') {
      // Abre el modal de producto y pasa los detalles
      this.nombreProducto = item.nombre;
      this.descripcionProducto = item.descripcion;
      this.valorProducto = item.precio;
      this.modalProducto.present();
    } else if (type === 'categoria') {
      this.nombreCategoria = item.categoria;
      //this.descripcionCategoria = item.descripcion;
      this.modalCategoria.present();
    } else if (type === 'subCategoria') {
      this.nombreSubCategoria = item.nombre;
      this.descripcionSubCategoria = item.descripcion;
      this.modalSubCategoria.present();
    }
  }



}
