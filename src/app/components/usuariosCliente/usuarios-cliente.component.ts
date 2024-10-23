import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-usuarios-cliente',
  templateUrl: './usuarios-cliente.component.html',
  styleUrls: ['./usuarios-cliente.component.scss'],
})
export class UsuariosClienteComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  message = 'Este modal se abre cuando el botón es presionado.';
  rut: string = "";
  nombre: string = "";
  tipoUsuario: string = "";
  cantidadVentas: number = 0;
  fechaRegistro: Date = new Date();

  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  // Cerrar el modal sin realizar cambios
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  // Guardar los cambios y cerrar el modal
  confirm() {
    this.modal.dismiss({
      rut: this.rut,
      nombre: this.nombre,
      tipoUsuario: this.tipoUsuario,
      cantidadVentas: this.cantidadVentas,
      fechaRegistro: this.fechaRegistro,
    }, 'confirm');
  }

  // Eliminar el usuario (con confirmación)
  async delete() {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro que deseas eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarUsuario();
          }
        }
      ]
    });

    await alert.present();
  }

  // Acción para eliminar el usuario
  eliminarUsuario() {
    // Aquí se puede agregar la lógica de eliminación real
    console.log('Usuario eliminado');
    this.modal.dismiss(null, 'eliminar');
  }

  // Manejar el cierre del modal y ejecutar la acción correspondiente
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<any>>;
    
    // Comprobamos si el modal se cerró con la acción de "confirm" o "eliminar"
    if (ev.detail.role === 'confirm') {
      const data = ev.detail.data;
      if (data) {
        this.message = `Usuario guardado: ${data.nombre}, ${data.sucursal}, ${data.tipoUsuario}`;
      }
    } else if (ev.detail.role === 'eliminar') {
      this.message = 'Usuario eliminado.';
    }
  }
}
