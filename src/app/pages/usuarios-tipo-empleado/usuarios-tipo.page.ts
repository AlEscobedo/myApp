import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios-tipo',
  templateUrl: './usuarios-tipo.page.html',
  styleUrls: ['./usuarios-tipo.page.scss'],
})
export class UsuariosTipoPage implements OnInit {

  constructor(private router: Router, private menu: MenuController) { }

  ngOnInit() {
  }
  async IrInicioAdmin() {    
    this.router.navigate(['/inicio-admin']);
  }
  async IrUsuariosAdmin() {    
    this.router.navigate(['/usuarios-admin']);
  }
}
