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
    this.router.navigate(['/home']);
  }
  async IrUsuariosAdmin() {
    this.router.navigate(['/usuarios-admin']);

  }
  async IrInicioAdmin() {
    this.router.navigate(['/inicio-admin']);
  }
  async IrUsuariosTipoEmpleado() {
    this.router.navigate(['/usuarios-tipo-empleado']);
  }
  async IrUsuariosTipoCliente() {
    this.router.navigate(['/usuarios-tipo-cliente']);
  }
}
