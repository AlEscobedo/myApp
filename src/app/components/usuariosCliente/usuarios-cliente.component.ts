import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { BaseDatosService } from 'src/app/services/base-datos.service';

@Component({
  selector: 'app-usuarios-cliente',
  templateUrl: './usuarios-cliente.component.html',
  styleUrls: ['./usuarios-cliente.component.scss'],
})
export class UsuariosClienteComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  message = 'Este modal se abre cuando el botón es presionado.';

  // Lista de usuarios
  usuarios: any[] = [];
  usuarioEditado: any = {};
  usuarioEditadoOriginal: any = {};

  constructor(private alertController: AlertController,
    private baseDatosService: BaseDatosService) { }

  ngOnInit() {
    this.baseDatosService.obtenerClientes().subscribe((data) => {

      this.usuarios = data;
    });
  }

  isModalOpen = false;
  isEditModalOpen = false;

  nuevoClienteNombre = '';
  nuevoClienteRut = '';
  nuevoClienteRol = 'Cliente';


  abrirModalNuevoCliente() {
    this.isModalOpen = true;
  }

  abrirModalEdicion(usuario: any) {
    this.usuarioEditadoOriginal = { ...usuario };  // Guardar los datos originales
    this.usuarioEditado = {
      ...usuario,
    };
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  closeModal() {
    this.nuevoClienteNombre = '';
    this.nuevoClienteRut = '';
    this.isModalOpen = false;
  }

  normalizarRut(rut: string): string {
    return rut.trim().replace(/\./g, '').replace('-', ''); // Elimina puntos y guion
  }

  async guardarEdicion() {
    try {
      // Verificar si hubo algún cambio en los campos
      if (
        this.usuarioEditado.Nombre === this.usuarioEditadoOriginal.Nombre
      ) {
        await this.mostrarMensaje('Sin cambios', 'No se realizaron cambios en los datos del usuario.');
        return;
      }

      // Si hubo cambios y las validaciones son correctas, llamamos al servicio para actualizar los datos
      await this.baseDatosService.actualizarUsuario(this.usuarioEditado);
      await this.mostrarMensaje('Éxito', 'Usuario actualizado exitosamente.');
      this.closeEditModal();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);  // Imprimir el error completo
      await this.mostrarMensaje('Error', 'Hubo un problema al actualizar el usuario.');
    }
  }

  async eliminarUsuario(usuario: any) {
    const confirmAlert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar este usuario?' + usuario.Nombre + ' ' + usuario.rut,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            // Llamar al servicio para eliminar el usuario
            try {
              await this.baseDatosService.eliminarUsuarioPorRutCliente(usuario.rut);  // Suponiendo que el usuario tiene un ID único
              this.usuarios = this.usuarios.filter(u => u.rut !== usuario.rut);  // Eliminar de la lista visual
              await this.mostrarMensaje('Éxito', 'Usuario eliminado exitosamente.');
            } catch (error) {
              await this.mostrarMensaje('Error', 'Hubo un problema al eliminar el usuario.');
            }
          },
        },
      ],
    });
    await confirmAlert.present();
  }


  async crearUsuario() {
    // Verificar que los campos no estén vacíos
    if (!this.nuevoClienteNombre.trim()) {
      await this.mostrarMensaje('Error', 'El campo "Nombre" no puede estar vacío.');
      return;
    }


    if (!this.nuevoClienteRut.trim()) {
      await this.mostrarMensaje('Error', 'El campo "RUT" no puede estar vacío.');
      return;
    }

    // Validar RUT
    if (!this.validarRut(this.nuevoClienteRut)) {
      await this.mostrarMensaje('Error', 'El RUT ingresado no es válido.');
      return;
    }

    // Verificar si el RUT ya existe en la base de datos
    const rutExistente = await this.baseDatosService.rutYaExisteCliente(this.nuevoClienteRut);
    if (rutExistente) {
      await this.mostrarMensaje('Error', 'El RUT ya se encuentra registrado.');
      return;
    }

    // Obtener la fecha actual en el formato requerido
    const fechaRegistro = new Date();
    const fechaFormateada = fechaRegistro.toLocaleString('es-CL', {
      weekday: 'long', // Día de la semana (miércoles, jueves, etc.)
      year: 'numeric',
      month: 'long',  // Mes completo (noviembre, enero, etc.)
      day: 'numeric', // Día del mes
    });

    const usuario = {
      Nombre: this.nuevoClienteNombre,
      rut: this.nuevoClienteRut,
      rol: 'Cliente',
      FechaRegistro: fechaFormateada,
    }

    // Guardar el usuario en la base de datos
    try {
      await this.baseDatosService.agregarUsuarioCliente(usuario);
      await this.mostrarMensaje('Éxito', 'El usuario ' + this.nuevoClienteNombre + ' se ha creado exitosamente.');
      this.nuevoClienteNombre = '';
      this.nuevoClienteRut = '';
      this.isModalOpen = false;

      // Limpiar los campos después de guardar
      this.nuevoClienteNombre = '';
      this.nuevoClienteRut = '';
      this.isModalOpen = false;
    } catch (error) {
      await this.mostrarMensaje('Error', 'Hubo un problema al guardar el usuario.');
    }

  }

  async mostrarMensaje(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  validarRut(rut: string): boolean {
    // Eliminar espacios en blanco al principio y al final
    const rutTrim = rut.trim();

    // Comprobar si el RUT tiene el formato correcto: 8 números + guion + 1 dígito
    const regex = /^\d{8}-[0-9Kk]{1}$/;

    // Verificar si el RUT coincide con la expresión regular
    if (!regex.test(rutTrim)) {
      return false;
    }

    // Separar el cuerpo del RUT y el dígito verificador
    const [cuerpo, dv] = rutTrim.split('-');

    // Verificar que el dígito verificador sea válido (calculado en función del cuerpo del RUT)
    if (!this.validarDigitoVerificador(cuerpo, dv)) {
      return false;
    }

    return true;
  }

  validarDigitoVerificador(cuerpo: string, dv: string): boolean {
    let suma = 0;
    let multiplo = 2;

    // Realizar el cálculo del dígito verificador
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    // Calcular el dígito verificador esperado
    const dvEsperado = 11 - (suma % 11);

    // Ajuste del dígito verificador
    const dvCalculado = dvEsperado === 10 ? 'K' : dvEsperado === 11 ? '0' : dvEsperado.toString();

    // Comprobar si el dígito verificador es correcto
    return dv.toUpperCase() === dvCalculado;
  }
}