import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseDatosService } from './services/base-datos.service';

import { AlertController, Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  categorias: any[] = [];  // Propiedad para almacenar los datos de la colección
  nuevaCategoria: string = '';  // Propiedad para la nueva categoría
  productos: any[] = [];  // Propiedad para almacenar los datos de la colección  

  constructor(private firestore: AngularFirestore, 
              private baseDatosService: BaseDatosService,
              private network: Network,
              private alertController: AlertController,
              private platform: Platform) {
    this.firestore.collection('Categoria').valueChanges().subscribe(data => {      
      this.categorias = data;  // Almacena los datos en la propiedad `categorias`
    });
    this.firestore.collection('Productos').valueChanges().subscribe(data => {
      this.productos = data;  // Almacena los datos en la propiedad `categorias`
    });
  }

  async ngOnInit() {
    this.platform.ready().then(() => {
      this.checkNetwork();
    });
  }

  async checkNetwork() {
    if (this.network.type === 'none') {
      this.showNoConnectionAlert();
    }

    // Detectar cambios en la conexión
    this.network.onDisconnect().subscribe(() => {
      this.showNoConnectionAlert();
    });

    this.network.onConnect().subscribe(() => {
      this.dismissAlert();
    });
  }

  // Mostrar alerta cuando no hay conexión
  async showNoConnectionAlert() {
    const alert = await this.alertController.create({
      header: 'Sin conexión a internet',
      message: 'Por favor, verifica tu conexión para continuar.',
      backdropDismiss: false,
    });
    await alert.present();
  }

  // Cerrar la alerta cuando se recupere la conexión
  async dismissAlert() {
    const alert = await this.alertController.getTop();
    if (alert) {
      alert.dismiss();
    }
  }
  
}
