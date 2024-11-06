import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.page.html',
  styleUrls: ['./inicio-admin.page.scss'],
})
export class InicioAdminPage implements OnInit {

  constructor(private router: Router, private menu: MenuController, private authService: AuthService) { }

  ngOnInit() {   
  }

  async IrHome() {
    await this.menu.close();
    await this.authService.clearCredentials();
    this.router.navigate(['/home']);
  }
  async IrUsuariosAdmin() {
    await this.menu.close();
    this.router.navigate(['/usuarios-admin']);
  }
  async IrMenuAdmin() {
    await this.menu.close();
    this.router.navigate(['/menu-admin']);
  }
  async IrAjusteAdmin() {
    await this.menu.close();
    this.router.navigate(['/ajuste-admin']);
  }
  async IrDashboard() {
    await this.menu.close();
    this.router.navigate(['/dashboard']);
  }
}
