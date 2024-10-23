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
  async IrHome() {
    await this.menu.close();
    this.menu.enable(false);
    this.router.navigate(['/home']);
  }
  async IrUsuariosAdmin() {
    await this.menu.close();
    this.menu.enable(false);
    this.router.navigate(['/usuarios-admin']);

  }
  async IrInicioAdmin() {
    await this.menu.close();
    this.menu.enable(false);
    this.router.navigate(['/inicio-admin']);
  }
  async IrUsuariosTipoEmpleado() {
    await this.menu.close();
    this.menu.enable(false);
    this.router.navigate(['/usuarios-tipo-empleado']);
  }
  async IrUsuariosTipoCliente() {
    await this.menu.close();
    this.menu.enable(false);
    this.router.navigate(['/usuarios-tipo-cliente']);
  }
}
