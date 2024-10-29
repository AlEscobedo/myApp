import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjusteAdminPage } from './ajuste-admin.page';

const routes: Routes = [
  {
    path: '',
    component: AjusteAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjusteAdminPageRoutingModule {}
