import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosAdminPageRoutingModule } from './usuarios-admin-routing.module';

import { UsuariosAdminPage } from './usuarios-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosAdminPageRoutingModule
  ],
  declarations: [UsuariosAdminPage]
})
export class UsuariosAdminPageModule {}
