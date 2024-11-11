import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
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
  @ViewChild('modalCrearProducto') modalCrearProducto!: IonModal;
  @ViewChild('modalCrearCategoria') modalCrearCategoria!: IonModal;

  message = 'Este modal se abre cuando el botón es presionado.';

  // Variables para modificación de producto y categoría
  nombreProducto: string = "";
  descripcionProducto: string = "";
  valorProducto: string = "";

  nombreCategoria: string = "";
  descripcionCategoria: string = "";

  // Variables para creación de producto y categoría
  nombreNuevoProducto: string = "";
  descripcionNuevoProducto: string = "";
  valorNuevoProducto: string = "";

  nombreNuevaCategoria: string = "";
  descripcionNuevaCategoria: string = "";

  constructor(private alertController: AlertController, private baseDatosService: BaseDatosService) { }

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
    } else if (modalType === 'crearProducto') {
      this.modalCrearProducto.dismiss(null, 'cancel');
    } else if (modalType === 'crearCategoria') {
      this.modalCrearCategoria.dismiss(null, 'cancel');
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
        descripcionCategoria: this.descripcionCategoria,
      }, 'confirm');
    } else if (modalType === 'crearProducto') {
      this.modalCrearProducto.dismiss({
        nombreNuevoProducto: this.nombreNuevoProducto,
        descripcionNuevoProducto: this.descripcionNuevoProducto,
        valorNuevoProducto: this.valorNuevoProducto,
      }, 'confirm');
    } else if (modalType === 'crearCategoria') {
      this.modalCrearCategoria.dismiss({
        nombreNuevaCategoria: this.nombreNuevaCategoria,
        descripcionNuevaCategoria: this.descripcionNuevaCategoria,
      }, 'confirm');
    }
  }

  // Eliminar acción con confirmación en el modal específico
  async delete(modalType: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro que deseas eliminar este ${modalType === 'producto' ? 'Producto' : 'Categoria'}?`,
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
    console.log('Categoría eliminada');
    this.modalCategoria.dismiss(null, 'eliminar');
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
      } else if (modalType === 'crearProducto' && data) {
        this.message = `Producto creado: ${data.nombreNuevoProducto}, ${data.descripcionNuevoProducto}, ${data.valorNuevoProducto}`;
      } else if (modalType === 'crearCategoria' && data) {
        this.message = `Categoría creada: ${data.nombreNuevaCategoria}, ${data.descripcionNuevaCategoria}`;
      }
    } else if (ev.detail.role === 'eliminar') {
      this.message = `${modalType === 'producto' ? 'Producto' : 'Categoría'} eliminado.`;
    }
  }



  // BASE DE DATOS //


}
