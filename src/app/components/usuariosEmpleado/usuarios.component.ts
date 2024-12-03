import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { BaseDatosService } from 'src/app/services/base-datos.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  message = 'Este modal se abre cuando el botón es presionado.';

  // Lista de usuarios
  usuarios: any[] = [];
  usuarioEditado: any = {};
  usuarioEditadoOriginal: any = {};

  constructor(private alertController: AlertController,
    private baseDatosService: BaseDatosService) { }

  ngOnInit() {
    this.baseDatosService.obtenerUsuarios().subscribe((data) => {
      // Filtrar los usuarios con rol "Empleado"
      this.usuarios = data;
    });
  }

  isModalOpen = false;
  isEditModalOpen = false;

  nuevoEmpleadoNombre = '';
  nuevoEmpleadoApellido = '';
  nuevoEmpleadoRut = '';
  nuevoEmpleadoTelefono = '';
  nuevoEmpleadoEmail = '';
  nuevoEmpleadoRol = 'Empleado';
  nuevoEmpleadoPassword = this.nuevoEmpleadoRut;

  abrirModalNuevoEmpleado() {
    this.isModalOpen = true;
  }
  abrirModalEdicion(usuario: any) {
    this.usuarioEditadoOriginal = { ...usuario };  // Guardar los datos originales
    const prefijo = '+569 ';
    this.usuarioEditado = {
      ...usuario,
      Telefono: usuario.Telefono.startsWith(prefijo) ? usuario.Telefono.slice(prefijo.length) : usuario.Telefono
    };
    this.isEditModalOpen = true;
  }



  closeEditModal() {
    this.isEditModalOpen = false;
  }

  closeModal() {
    this.nuevoEmpleadoNombre = '';
    this.nuevoEmpleadoApellido = '';
    this.nuevoEmpleadoRut = '';
    this.nuevoEmpleadoTelefono = '';
    this.nuevoEmpleadoEmail = '';
    this.isModalOpen = false;
  }
  normalizarRut(rut: string): string {
    return rut.trim().replace(/\./g, '').replace('-', ''); // Elimina puntos y guion
  }


  async guardarEdicion() {
    try {
      // Verificar si hubo algún cambio en los campos
      if (
        this.usuarioEditado.Nombres === this.usuarioEditadoOriginal.Nombres &&
        this.usuarioEditado.Apellidos === this.usuarioEditadoOriginal.Apellidos &&
        this.usuarioEditado.Telefono === this.usuarioEditadoOriginal.Telefono &&
        this.usuarioEditado.Email === this.usuarioEditadoOriginal.Email &&
        this.usuarioEditado.rol === this.usuarioEditadoOriginal.rol
      ) {
        await this.mostrarMensaje('Sin cambios', 'No se realizaron cambios en los datos del usuario.');
        return;
      }

      // Validar teléfono
      const prefijo = '+569 ';
      const telefonoCompleto = prefijo + this.usuarioEditado.Telefono;

      if (!this.validarTelefono(this.usuarioEditado.Telefono)) {
        await this.mostrarMensaje('Error', 'El número de teléfono debe contener 8 dígitos.');
        return;
      }

      this.usuarioEditado.Telefono = telefonoCompleto;

      // Validar email
      if (!this.validarEmail(this.usuarioEditado.Email)) {
        await this.mostrarMensaje('Error', 'El EMAIL ingresado no es válido.');
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




  //Metodo para eliminar usuario
  // Función para eliminar el usuario
  async eliminarUsuario(usuario: any) {
    const confirmAlert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar este usuario?' + usuario.Nombres + ' ' + usuario.rut,
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
              await this.baseDatosService.eliminarUsuarioPorRut(usuario.rut);  // Suponiendo que el usuario tiene un ID único
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


  // Método para crear usuario
  async crearUsuario() {
    // Verificar que los campos no estén vacíos
    if (!this.nuevoEmpleadoNombre.trim()) {
      await this.mostrarMensaje('Error', 'El campo "Nombre" no puede estar vacío.');
      return;
    }

    if (!this.nuevoEmpleadoApellido.trim()) {
      await this.mostrarMensaje('Error', 'El campo "Apellido" no puede estar vacío.');
      return;
    }

    if (!this.nuevoEmpleadoRut.trim()) {
      await this.mostrarMensaje('Error', 'El campo "RUT" no puede estar vacío.');
      return;
    }

    // Validar RUT
    if (!this.validarRut(this.nuevoEmpleadoRut)) {
      await this.mostrarMensaje('Error', 'El RUT ingresado no es válido.');
      return;
    }

    // Verificar si el RUT ya existe en la base de datos
    const rutExistente = await this.baseDatosService.rutYaExiste(this.nuevoEmpleadoRut);
    if (rutExistente) {
      await this.mostrarMensaje('Error', 'El RUT ya se encuentra registrado.');
      return;
    }

    // Continuar con el proceso si el RUT es válido y no existe
    if (!this.nuevoEmpleadoTelefono.trim()) {
      await this.mostrarMensaje('Error', 'El campo "Teléfono" no puede estar vacío.');
      return;
    }

    if (!this.validarTelefono(this.nuevoEmpleadoTelefono)) {
      await this.mostrarMensaje('Error', 'El número de teléfono debe comenzar con +56 y contener 9 dígitos.');
      return;
    }

    if (!this.nuevoEmpleadoEmail.trim()) {
      await this.mostrarMensaje('Error', 'El campo "Email" no puede estar vacío.');
      return;
    }

    if (!this.validarEmail(this.nuevoEmpleadoEmail)) {
      await this.mostrarMensaje('Error', 'El EMAIL ingresado no es válido.');
      return;
    }
    const inicio = '+569 ';
    const telefonoCompleto = inicio + this.nuevoEmpleadoTelefono;
    const usuario = {
      Nombres: this.nuevoEmpleadoNombre,
      Apellidos: this.nuevoEmpleadoApellido,
      rut: this.nuevoEmpleadoRut,
      Telefono: telefonoCompleto,
      Email: this.nuevoEmpleadoEmail,
      rol: 'Empleado'
    }
    console.log('Valor de nuevoEmpleadoTelefono:', this.nuevoEmpleadoTelefono);

    // Guardar el usuario en la base de datos
    try {
      await this.baseDatosService.agregarUsuario(usuario);
      await this.mostrarMensaje('Éxito', 'El usuario ' + this.nuevoEmpleadoNombre + ' ' + this.nuevoEmpleadoApellido + ' se ha creado exitosamente.');
      this.nuevoEmpleadoNombre = '';
      this.nuevoEmpleadoApellido = '';
      this.nuevoEmpleadoRut = '';
      this.nuevoEmpleadoTelefono = '';
      this.nuevoEmpleadoEmail = '';
      this.isModalOpen = false;

      // Limpiar los campos después de guardar
      this.nuevoEmpleadoNombre = '';
      this.nuevoEmpleadoApellido = '';
      this.nuevoEmpleadoRut = '';
      this.nuevoEmpleadoTelefono = '';
      this.nuevoEmpleadoEmail = '';
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

  // Validar si el correo tiene un formato válido
  validarEmail(correo: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(correo);
  }

  // Función para validar el RUT
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

  // Función para validar el dígito verificador
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



  // Validar teléfono con el formato +56 seguido de 9 dígitos
  validarTelefono(telefono: string): boolean {
    const regexTelefono = /^\d{8}$/;  // Solo 9 dígitos
    return regexTelefono.test(telefono);
  }

}
