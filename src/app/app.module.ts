import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EditModalAjusteAdminModule } from './components/edit-modal-ajuste-admin/edit-modal-ajuste-admin-module';

//-- Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            AppRoutingModule,
            EditModalAjusteAdminModule,
            IonicStorageModule.forRoot(),
            AngularFireModule.initializeApp(environment.firebaseConfig), // inicializa Firebase
            AngularFireAuthModule, // Modulo de autenticacion
            AngularFirestoreModule], // Modulo de bd firestore
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
