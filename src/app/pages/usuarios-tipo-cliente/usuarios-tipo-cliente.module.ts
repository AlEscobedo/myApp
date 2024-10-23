import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosTipoClientePageRoutingModule } from './usuarios-tipo-cliente-routing.module';

import { UsuariosTipoClientePage } from './usuarios-tipo-cliente.page';
import { UsuariosComponent } from 'src/app/components/usuariosEmpleado/usuarios.component';
import { UsuariosClienteComponent } from 'src/app/components/usuariosCliente/usuarios-cliente.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosTipoClientePageRoutingModule
  ],
  declarations: [UsuariosTipoClientePage,
    UsuariosClienteComponent         
  ]
})
export class UsuariosTipoClientePageModule {}
