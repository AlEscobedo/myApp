import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjusteAdminPageRoutingModule } from './ajuste-admin-routing.module';

import { AjusteAdminPage } from './ajuste-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjusteAdminPageRoutingModule
  ],
  declarations: [AjusteAdminPage]
})
export class AjusteAdminPageModule {}
