import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-menu-lista',
  templateUrl: './menu-lista.component.html',
  styleUrls: ['./menu-lista.component.scss'],
})
export class MenuListaComponent  implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  message = 'Este modal se abre cuando el botón es presionado.';
  nombreProducto: string = "";
  descripcionProducto: string = "";
  valorProducto: string = "";
  

  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  // Cerrar el modal sin realizar cambios
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  // Guardar los cambios y cerrar el modal
  confirm() {
    this.modal.dismiss({
      nombreProducto: this.nombreProducto,
      descripcionProducto: this.descripcionProducto,
      valorProducto: this.valorProducto,
      
    }, 'confirm');
  }

  // Eliminar el usuario (con confirmación)
  async delete() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro que deseas eliminar este Producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarProducto();
          }
        }
      ]
    });

    await alert.present();
  }

  // Acción para eliminar el usuario
  eliminarProducto() {
    // Aquí se puede agregar la lógica de eliminación real
    console.log('Producto eliminado');
    this.modal.dismiss(null, 'eliminar');
  }

  // Manejar el cierre del modal y ejecutar la acción correspondiente
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<any>>;
    
    // Comprobamos si el modal se cerró con la acción de "confirm" o "eliminar"
    if (ev.detail.role === 'confirm') {
      const data = ev.detail.data;
      if (data) {
        this.message = `Producto guardado: ${data.nombre}, ${data.sucursal}, ${data.tipoUsuario}`;
      }
    } else if (ev.detail.role === 'eliminar') {
      this.message = 'Producto eliminado.';
    }
  }
}