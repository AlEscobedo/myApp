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
  fechaRegistroString: string = "";
  usuarioActual: any;  // Para almacenar el usuario que se está editando

  // Lista de usuarios
  usuarios = [
    {
      id: 1,
      rut: '12.345.678-9',
      nombre: 'Franco Escobedo',
      tipoUsuario: 'Cliente',
      cantidadVentas: 43,
      fechaRegistro: new Date('2022-01-01'),
      imagen: 'https://media.licdn.com/dms/image/v2/D5603AQHGELgkbotZhg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1683038794336?e=1735171200&v=beta&t=l_F62YfEhaBAHey85A2Jm6KysKdvAzx8XSUAzVOyZuw'
    },
    {
      id: 2,
      rut: '23.456.789-0',
      nombre: 'Rodrigo Alegria',
      tipoUsuario: 'Cliente',
      cantidadVentas: 30,
      fechaRegistro: new Date('2022-02-05'),
      imagen: 'https://media.licdn.com/dms/image/v2/D4E35AQFCPKNFLUfswg/profile-framedphoto-shrink_100_100/profile-framedphoto-shrink_100_100/0/1721843334323?e=1731193200&v=beta&t=-ceQsn549Pr6uiVT9efiOttFrIEud1nThgEBGl4Z_-I'
    },
    {
      id: 3,
      rut: '34.567.890-1',
      nombre: 'Tagle Benjamin',
      tipoUsuario: 'Cliente',
      cantidadVentas: 10,
      fechaRegistro: new Date('2022-03-25'),
      imagen: 'https://thumbs.dreamstime.com/b/hombre-de-negocios-icon-persona-inc%C3%B3gnita-desconocida-silueta-del-en-el-fondo-blanco-112802675.jpg'
    }
  ];

  constructor(private alertController: AlertController) { }

  ngOnInit() { }

  // Función para abrir el modal y cargar los datos del usuario
  abrirModal(usuario: any) {
    this.usuarioActual = usuario;  // Guarda el usuario actual para actualizar después
    this.rut = usuario.rut;
    this.nombre = usuario.nombre;
    this.tipoUsuario = usuario.tipoUsuario;
    this.cantidadVentas = usuario.cantidadVentas;

    // Formatear la fecha para mostrarla en el input de tipo date
    const fecha = new Date(usuario.fechaRegistro);
    this.fechaRegistroString = fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD    

    this.modal.present();  // Abre el modal
  }



  // Cerrar el modal sin realizar cambios
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  // Guardar los cambios y cerrar el modal
  confirm() {
    this.usuarioActual.rut = this.rut;
    this.usuarioActual.nombre = this.nombre;
    this.usuarioActual.tipoUsuario = this.tipoUsuario;
    this.usuarioActual.cantidadVentas = this.cantidadVentas;

    // Convertir la cadena de vuelta a un objeto Date si es necesario
    this.usuarioActual.fechaRegistro = new Date(this.fechaRegistroString);

    this.modal.dismiss({
      nombre: this.usuarioActual.nombre,
      rut: this.usuarioActual.rut,
      tipoUsuario: this.usuarioActual.tipoUsuario,
      cantidadVentas: this.usuarioActual.cantidadVentas,
      fechaRegistro: this.usuarioActual.fechaRegistro,
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
