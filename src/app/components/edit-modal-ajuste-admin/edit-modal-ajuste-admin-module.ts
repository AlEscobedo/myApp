import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí
import { IonicModule } from '@ionic/angular'; // Importa IonicModule aquí
import { EditModalAjusteAdminComponent } from './edit-modal-ajuste-admin.component';

@NgModule({
  declarations: [EditModalAjusteAdminComponent],
  imports: [
    CommonModule,
    FormsModule, // Asegúrate de incluir FormsModule
    IonicModule, // Asegúrate de incluir IonicModule
  ],
  exports: [EditModalAjusteAdminComponent],
})
export class EditModalAjusteAdminModule {}
