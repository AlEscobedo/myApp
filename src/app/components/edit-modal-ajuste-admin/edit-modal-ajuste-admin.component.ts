import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-modal-ajuste-admin',
  templateUrl: './edit-modal-ajuste-admin.component.html',
  styleUrls: ['./edit-modal-ajuste-admin.component.scss'],
})
export class EditModalAjusteAdminComponent  implements OnInit {
  @Input() title: string ="";
  @Input() currentValue: string ="";
  @Input() isImage: boolean = false; // Para determinar si se está editando una imagen
  
  newValue!: string;


  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.newValue = this.currentValue;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.newValue = reader.result as string; // Guarda la imagen como una URL base64
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  async save() {
    // Aquí puedes manejar la lógica para guardar el nuevo valor
    // En este ejemplo, simplemente cerramos el modal
    await this.modalController.dismiss(this.newValue);
  }

  async close() {
    await this.modalController.dismiss();
  }
}
