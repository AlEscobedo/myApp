import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios-tipo-cliente',
  templateUrl: './usuarios-tipo-cliente.page.html',
  styleUrls: ['./usuarios-tipo-cliente.page.scss'],
})
export class UsuariosTipoClientePage implements OnInit {

  constructor(private router: Router, private menu: MenuController) { }

  ngOnInit() {
  }
  async IrUsuariosAdmin() {
    await this.menu.close();
    this.menu.enable(false);
    this.router.navigate(['/usuarios-admin']);
  }
}
