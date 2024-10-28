import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.page.html',
  styleUrls: ['./menu-admin.page.scss'],
})
export class MenuAdminPage implements OnInit {

  constructor(private router: Router, private menu: MenuController) { }

  ngOnInit() {
  }
  async IrInicioAdmin() {
    this.router.navigate(['/inicio-admin']);
  }
}