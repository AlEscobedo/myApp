import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosTipoClientePage } from './usuarios-tipo-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosTipoClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosTipoClientePageRoutingModule {}
