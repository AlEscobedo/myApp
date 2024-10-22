import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosTipoPage } from './usuarios-tipo.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosTipoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosTipoPageRoutingModule {}
