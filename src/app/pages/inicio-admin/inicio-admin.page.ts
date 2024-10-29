import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.page.html',
  styleUrls: ['./inicio-admin.page.scss'],
})
export class InicioAdminPage implements OnInit {

  constructor(private router: Router, private menu: MenuController) { }

  ngOnInit() {   
  }

  async IrHome() {
    await this.menu.close();
    this.router.navigate(['/home']);
  }
  async IrUsuariosAdmin() {
    await this.menu.close();
    this.menu.enable(false);
    this.router.navigate(['/usuarios-admin']);
  }
  async IrMenuAdmin() {
    await this.menu.close();
    this.menu.enable(false);
    this.router.navigate(['/menu-admin']);
  }
  async IrAjusteAdmin() {
    await this.menu.close();
    this.menu.enable(false);
    this.router.navigate(['/ajuste-admin']);
  }
}
