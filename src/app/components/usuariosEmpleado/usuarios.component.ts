import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  message = 'Este modal se abre cuando el botón es presionado.';
  rut: string = "";
  nombre: string = "";
  tipoUsuario: string = "";
  cantidadVentas: number = 0;
  fechaRegistroString: string = "";
  imagenUrl: string = "";
  imagenPreview: string | ArrayBuffer | null = ""; // Para la vista previa
  usuarioActual: any;  // Para almacenar el usuario que se está editando
  usuarioOriginal: any;
  esEdicion: boolean = false;

  // Lista de usuarios
  usuarios = [
    {
      id: 1,
      rut: '19.709.735-3',
      nombre: 'Alejandro Escobedo',
      tipoUsuario: 'Empleado',
      cantidadVentas: 90,
      fechaRegistro: new Date('2022-01-01'),
      imagen: 'assets/imagenes/imgPredeterminada.png'
    },
    {
      id: 2,
      rut: '20.063.605-8',
      nombre: 'Nicolas Moreno',
      tipoUsuario: 'Empleado',
      cantidadVentas: 50,
      fechaRegistro: new Date('2022-02-05'),
      imagen: 'assets/imagenes/imgPredeterminada.png'
    },
    {
      id: 3,
      rut: '20.658.154-9',
      nombre: 'Benjamin Tagle',
      tipoUsuario: 'Empleado',
      cantidadVentas: 20,
      fechaRegistro: new Date('2022-03-25'),
      imagen: 'assets/imagenes/imgPredeterminada.png'
    }
  ];

  constructor(private alertController: AlertController) { }

  ngOnInit() { }

  // Función para abrir el modal y cargar los datos del usuario
  abrirModal(usuario: any) {
    this.usuarioActual = usuario;  // Define el usuario actual para edición
    this.usuarioOriginal = { ...usuario };
    this.esEdicion = true;

    this.rut = usuario.rut;
    this.nombre = usuario.nombre;
    this.tipoUsuario = usuario.tipoUsuario;
    this.cantidadVentas = usuario.cantidadVentas;
    this.imagenPreview = usuario.imagen;
    

    // Formatea la fecha para mostrarla en el input de tipo date
    const fecha = new Date(usuario.fechaRegistro);
    this.fechaRegistroString = fecha.toISOString().split('T')[0];

    this.modal.present();  // Abre el modal
  }

  // Cerrar el modal sin realizar cambios
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    if (!this.validarRut(this.rut)) {
      const alert = await this.alertController.create({
        header: 'RUT no válido',
        message: 'Por favor ingresa un RUT válido.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const imagenFinal = typeof this.imagenPreview === 'string' ? this.imagenPreview : this.imagenUrl;

    if (this.usuarioActual) {
      // Editar usuario existente: solo actualiza campos que hayan cambiado
      if (this.rut !== this.usuarioOriginal.rut) {
        this.usuarioActual.rut = this.rut;
      }
      if (this.nombre !== this.usuarioOriginal.nombre) {
        this.usuarioActual.nombre = this.nombre;
      }
      if (this.tipoUsuario !== this.usuarioOriginal.tipoUsuario) {
        this.usuarioActual.tipoUsuario = this.tipoUsuario;
      }
      if (this.cantidadVentas !== this.usuarioOriginal.cantidadVentas) {
        this.usuarioActual.cantidadVentas = this.cantidadVentas;
      }
      if (this.fechaRegistroString !== this.usuarioOriginal.fechaRegistro.toISOString().split('T')[0]) {
        this.usuarioActual.fechaRegistro = new Date(this.fechaRegistroString);
      }
      if (imagenFinal !== this.usuarioOriginal.imagen) {
        this.usuarioActual.imagen = imagenFinal;
      }
    }

    this.modal.dismiss({
      nombre: this.nombre,
      rut: this.rut,
      tipoUsuario: this.tipoUsuario,
      cantidadVentas: this.cantidadVentas,
      fechaRegistro: new Date(this.fechaRegistroString),
      imagen: imagenFinal
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

  abrirModalNuevoEmpleado() {
    this.usuarioActual = null;  // Usuario nuevo, así que dejamos usuarioActual en null
    this.rut = '';
    this.nombre = '';
    this.tipoUsuario = 'Empleado';
    this.cantidadVentas = 0;
    this.fechaRegistroString = new Date().toISOString().split('T')[0];  // Fecha actual
    this.imagenPreview = '';
    this.esEdicion = false;
    this.modal.present();  // Abre el modal
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result; // Almacena la imagen en base64
      };
      reader.readAsDataURL(file); // Lee el archivo como URL base64
    }
  }
  validarRut(rut: string): boolean {
    // Remover puntos y guion del RUT
    const rutSinFormato = rut.replace(/\./g, '').replace('-', '');

    // Verificar que el RUT tenga al menos 9 caracteres
    if (rutSinFormato.length < 9) return false;

    // Separar el número base y el dígito verificador
    const cuerpo = rutSinFormato.slice(0, -1);
    let dv = rutSinFormato.slice(-1).toUpperCase();

    // Calcular el dígito verificador esperado
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    dv = dv === 'K' ? '10' : dv === '0' ? '11' : dv;

    return dv === dvEsperado.toString();
  }



  // Acción para eliminar el usuario
  eliminarUsuario() {
    if (this.usuarioActual) {
      // Encuentra el índice del usuario en la lista
      const index = this.usuarios.findIndex(user => user.id === this.usuarioActual.id);
      if (index > -1) {
        // Elimina el usuario de la lista
        this.usuarios.splice(index, 1);
        console.log('Usuario eliminado');
      }
    }
    this.modal.dismiss(null, 'eliminar');
  }


  // Manejar el cierre del modal y ejecutar la acción correspondiente
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<any>>;

    if (ev.detail.role === 'confirm') {
      const data = ev.detail.data;
      if (data && !this.usuarioActual) {
        // Solo mostrar el mensaje si es un nuevo usuario (para evitar duplicados)
        this.message = `Nuevo empleado agregado: ${data.nombre}`;
      } else {
        this.message = `Usuario guardado: ${data.nombre}`;
      }
    } else if (ev.detail.role === 'eliminar') {
      this.message = 'Usuario eliminado.';
    }
  }

}