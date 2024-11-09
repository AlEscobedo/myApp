import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-modal-ajuste-admin',
  templateUrl: './edit-modal-ajuste-admin.component.html',
  styleUrls: ['./edit-modal-ajuste-admin.component.scss'],
})
export class EditModalAjusteAdminComponent implements OnInit {
  @Input() title: string = "";
  @Input() currentValue: string = "";
  @Input() isImage: boolean = false;  // Determina si estamos editando una imagen

  newValue!: string;
  imagePreview!: string | ArrayBuffer | null;  // Propiedad para la previsualización de la imagen

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.newValue = this.currentValue;
    this.imagePreview = this.currentValue || null;  // Si ya hay una imagen, mostrarla
  }

  // Maneja la selección de archivos (imagen)
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result;  // Establece la previsualización de la imagen seleccionada
        this.newValue = this.imagePreview as string; // También actualiza el valor para que se guarde
      };

      reader.readAsDataURL(file);  // Lee el archivo como un URL base64
    }
  }

  // Guarda el nuevo valor y cierra el modal
  async save() {
    await this.modalController.dismiss(this.newValue);
  }

  // Cierra el modal sin hacer cambios
  async close() {
    await this.modalController.dismiss();
  }
}
