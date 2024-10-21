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
  ionViewWillEnter() {
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

}
