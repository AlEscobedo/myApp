import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EditModalAjusteAdminComponent } from 'src/app/components/edit-modal-ajuste-admin/edit-modal-ajuste-admin.component';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-ajuste-admin',
  templateUrl: './ajuste-admin.page.html',
  styleUrls: ['./ajuste-admin.page.scss'],
})
export class AjusteAdminPage implements OnInit {
  username: string = 'Admin Jon';
  fullName: string = 'Jon Doe';
  email: string = 'jon.doe@admin.cl';
  password: string = '********';
  imageUrl: string = ''; // Aquí defines la propiedad imageUrl

  constructor(private router: Router, private modalController: ModalController, private imageService: ImageService) { }

  ngOnInit() {
    this.imageService.getImage$().subscribe(url => {
      this.imageUrl = url;  // Actualiza la propiedad local cuando el servicio emite un nuevo valor
    });
  }
  async IrInicioAdmin() {
    this.router.navigate(['/inicio-admin']);
  }

  async openImageModal() {
    const modal = await this.modalController.create({
      component: EditModalAjusteAdminComponent,
      componentProps: {
        title: 'Editar Imagen',
        currentValue: this.imageUrl, // URL de la imagen actual
        isImage: true, // Indica que se está editando una imagen
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.imageUrl = result.data; // Actualiza el valor local con la nueva imagen
        this.imageService.setImage(result.data); // Actualiza la imagen en el servicio
      }
    });

    return await modal.present();
  }


  async openUserModal() {
    const modal = await this.modalController.create({
      component: EditModalAjusteAdminComponent,
      componentProps: {
        title: 'Editar Usuario',
        currentValue: this.username,
      },
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.username = result.data; // Actualiza el valor
      }
    });

    return await modal.present();
  }
  async openNameModal() {
    const modal = await this.modalController.create({
      component: EditModalAjusteAdminComponent,
      componentProps: {
        title: 'Editar Nombre Completo',
        currentValue: this.fullName,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.fullName = result.data; // Actualiza el valor
      }
    });

    return await modal.present();
  }

  async openEmailModal() {
    const modal = await this.modalController.create({
      component: EditModalAjusteAdminComponent,
      componentProps: {
        title: 'Editar Correo',
        currentValue: this.email,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.email = result.data; // Actualiza el valor
      }
    });

    return await modal.present();
  }

  async openPasswordModal() {
    const modal = await this.modalController.create({
      component: EditModalAjusteAdminComponent,
      componentProps: {
        title: 'Editar Contraseña',
        currentValue: this.password,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.password = result.data; // Actualiza el valor
      }
    });

    return await modal.present();
  }
}
