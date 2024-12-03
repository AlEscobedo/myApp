import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }
  // Inicializar el almacenamiento
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Guardar el ID y la clave del usuario
  async setCredentials(id: string, clave: string) {
    await this._storage?.set('userId', id);
    await this._storage?.set('userKey', clave);
  }

  // Obtener el ID
  async getId(): Promise<string | null> {
    return await this._storage?.get('userId');
  }

  // Obtener la clave
  async getClave(): Promise<string | null> {
    return await this._storage?.get('userKey');
  }

  // Limpiar las credenciales (logout)
  async clearCredentials() {
    await this._storage?.remove('userId');
    await this._storage?.remove('userKey');
  }


  


}
