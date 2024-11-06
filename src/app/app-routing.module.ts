import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'inicio-admin',
    loadChildren: () => import('./pages/inicio-admin/inicio-admin.module').then( m => m.InicioAdminPageModule)
  },
  {
    path: 'usuarios-admin',
    loadChildren: () => import('./pages/usuarios-admin/usuarios-admin.module').then( m => m.UsuariosAdminPageModule)
  },
  {
    path: 'usuarios-tipo-empleado',
    loadChildren: () => import('./pages/usuarios-tipo-empleado/usuarios-tipo.module').then( m => m.UsuariosTipoPageModule)
  },
  {
    path: 'usuarios-tipo-cliente',
    loadChildren: () => import('./pages/usuarios-tipo-cliente/usuarios-tipo-cliente.module').then( m => m.UsuariosTipoClientePageModule)
  },
  {
    path: 'menu-admin',
    loadChildren: () => import('./pages/menu-admin/menu-admin.module').then( m => m.MenuAdminPageModule)
  },  {
    path: 'ajuste-admin',
    loadChildren: () => import('./pages/ajuste-admin/ajuste-admin.module').then( m => m.AjusteAdminPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },



  



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
