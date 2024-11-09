import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ImageService } from '../services/image.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  username: string = '';
  password: string = '';
  passwordType: string = 'password';  // Tipo de input para la contraseña
  passwordIcon: string = 'eye-off';   // Icono por defecto
  imageUrl: string = '';  // Aquí se almacenará la URL de la imagen
  rememberMe: boolean = false;  // Estado del checkbox "Recordarme"

  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private authService: AuthService, 
    private imageService: ImageService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();  // Asegúrate de que Ionic Storage esté listo
    this.loadStoredCredentials();  // Cargar credenciales almacenadas al inicio

    // Nos suscribimos al observable para obtener la imagen actualizada
    this.imageService.getImage$().subscribe(url => {
      this.imageUrl = url;  // Asigna la URL actualizada de la imagen
    });
  }

  // Cargar las credenciales almacenadas si el usuario eligió "Recordarme"
  async loadStoredCredentials() {
    const storedUsername = await this.storage.get('username');
    const storedPassword = await this.storage.get('password');
    const rememberMe = await this.storage.get('rememberMe');

    if (rememberMe && storedUsername && storedPassword) {
      this.username = storedUsername;
      this.password = storedPassword;
      this.rememberMe = true;
      this.login();  // Iniciar sesión automáticamente si las credenciales están almacenadas
    }
  }

  // Método para iniciar sesión
  async login() {
    if (this.username === 'admin' && this.password === 'admin123') {
      // Guardar las credenciales en el almacenamiento si "Recordarme" está marcado
      if (this.rememberMe) {
        await this.storage.set('username', this.username);
        await this.storage.set('password', this.password);
        await this.storage.set('rememberMe', true);
      } else {
        // Si no se marca "Recordarme", eliminamos las credenciales almacenadas
        await this.storage.remove('username');
        await this.storage.remove('password');
        await this.storage.remove('rememberMe');
      }

      // Navegar a la página de inicio del administrador
      this.router.navigate(['/inicio-admin']);

      // Limpiar los campos de entrada
      this.username = '';
      this.password = '';
    } else {
      // Mostrar una alerta de error si las credenciales son incorrectas
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos',
        buttons: ['OK'],
      });
      await alert.present();

      // Limpiar la contraseña en caso de error
      this.password = '';
    }
  }

  // Toggle para mostrar/ocultar la contraseña
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  // Método para cerrar sesión
  async logout() {
    // Eliminar las credenciales almacenadas
    await this.storage.remove('username');
    await this.storage.remove('password');
    await this.storage.remove('rememberMe');

    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/home']);
  }
}
