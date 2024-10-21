import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.page.html',
  styleUrls: ['./usuarios-admin.page.scss'],
})
export class UsuariosAdminPage implements OnInit {

  constructor(private router: Router, private menu: MenuController) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.menu.close();
    this.menu.enable(true);
  }
  IrHome(){
    this.menu.close();
    this.router.navigate(['/home']);
  }
  IrUsuariosAdmin(){
    this.menu.close();
    this.router.navigate(['/usuarios-admin']);
  }
  IrInicioAdmin(){
    this.menu.close();
    this.router.navigate(['/inicio-admin']);
  }
}
