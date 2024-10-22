import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosTipoPageRoutingModule } from './usuarios-tipo-routing.module';

import { UsuariosTipoPage } from './usuarios-tipo.page';
import { UsuariosComponent } from 'src/app/components/usuariosEmpleado/usuarios.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosTipoPageRoutingModule
  ],
  declarations: [UsuariosTipoPage,
                 UsuariosComponent
  ]
})
export class UsuariosTipoPageModule {}
