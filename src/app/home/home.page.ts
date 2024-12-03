import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  email: string = '';
  password: string = '';
  passwordType: string = 'password'; // Tipo de input para la contraseña
  passwordIcon: string = 'eye-off';  // Icono por defecto

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  // Método para iniciar sesión
  async login() {
    if (!this.email?.trim()) {
      this.showAlert('Error', 'Por favor, ingresa tu email.');
      return;
    }
    if (!this.password?.trim()) {
      this.showAlert('Error', 'Por favor, ingresa tu contraseña.');
      this.password = '';
      return;
    }
    try {
      // Autenticación con Firebase Auth
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        this.email.trim(),
        this.password.trim()
      );

      const email = userCredential.user?.email;


      if (email) {
        // Consultar Firestore para el rol del usuario
        const userCollection = this.firestore.collection('Usuario', (ref) =>
          ref.where('Email', '==', email)
        );
        const userSnapshot = await userCollection.get().toPromise();

        if (userSnapshot && !userSnapshot.empty) {
          const userData: any = userSnapshot.docs[0].data();

          // Redirigir según el rol
          if (userData.rol === 'Admin') {
            this.password = '';
            this.email = '';
            this.router.navigate(['/inicio-admin']); // Ruta para admin
          } else if (userData.rol === 'Empleado') {
            this.router.navigate(['/inicio-empleado']); // Ruta para empleado
          } else {
            this.password = '';
            this.showAlert('Error', 'Rol no definido. Contacta al administrador.');
          }
        } else {
          this.password = '';
          this.showAlert('Error', 'Usuario no encontrado en la base de datos.');
        }
      }
    } catch (error: any) {
      this.password = '';
      console.error('Error al iniciar sesión:', 'Usuario y/o contraseña Incorrectos');

      // Manejo de error por contraseña incorrecta o datos mal formateados
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        this.password = '';
        this.showAlert('Error', 'Usuario o contraseña incorrectos.');
      } else {
        this.password = '';
        const errorMessage =
          error?.message || 'Ocurrió un error al iniciar sesión. Inténtalo nuevamente.';
        this.showAlert('Error', 'Usuario y/o contraseña Incorrectos');
      }
    }
  }


  // Toggle para mostrar/ocultar la contraseña
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  // Mostrar alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
