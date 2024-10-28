import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-menu-lista',
  templateUrl: './menu-lista.component.html',
  styleUrls: ['./menu-lista.component.scss'],
})
export class MenuListaComponent implements OnInit {
  @ViewChild('modalProducto') modalProducto!: IonModal;
  @ViewChild('modalCategoria') modalCategoria!: IonModal;

  message = 'Este modal se abre cuando el botón es presionado.';
  nombreProducto: string = "";
  descripcionProducto: string = "";
  valorProducto: string = "";
  nombreCategoria: string = "";
  descripcionCategoria: string = "";

  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  // Cerrar el modal específico
  cancel(modalType: string) {
    if (modalType === 'producto') {
      this.modalProducto.dismiss(null, 'cancel');
    } else if (modalType === 'categoria') {
      this.modalCategoria.dismiss(null, 'cancel');
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
      }
    } else if (ev.detail.role === 'eliminar') {
      this.message = `${modalType === 'producto' ? 'Producto' : 'Categoría'} eliminado.`;
    }
  }
}
