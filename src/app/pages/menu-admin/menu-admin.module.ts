import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuAdminPageRoutingModule } from './menu-admin-routing.module';

import { MenuAdminPage } from './menu-admin.page';
import { MenuListaComponent } from 'src/app/components/menu-lista/menu-lista.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuAdminPageRoutingModule,
  ],
  declarations: [MenuAdminPage,
    MenuListaComponent
  ]
})
export class MenuAdminPageModule {}
