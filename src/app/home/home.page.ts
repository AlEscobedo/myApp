import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  username: string = '';
  password: string = '';
  passwordType: string = 'password';  // Tipo de input para la contraseña
  passwordIcon: string = 'eye-off';   // Icono por defecto
  

  constructor(private router: Router, private alertController: AlertController, private authService: AuthService) { }

  async login() {
    if (this.username === 'admin' && this.password === 'admin123') {
      // Guardar credenciales en el almacenamiento
      await this.authService.setCredentials(this.username, this.password);
      // Navegar a la página de inicio del administrador
      this.router.navigate(['/inicio-admin']);
    } else {
      // Muestra una alerta de error
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
