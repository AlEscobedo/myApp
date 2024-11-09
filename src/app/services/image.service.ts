import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageUrlSubject: BehaviorSubject<string> = new BehaviorSubject<string>('assets/imagenes/imgPredeterminada.png');  // Valor inicial por defecto

  constructor() { }

  // Obtener el observable de la imagen
  getImage$() {
    return this.imageUrlSubject.asObservable();
  }

  // Establecer una nueva URL de imagen
  setImage(url: string): void {
    this.imageUrlSubject.next(url);
  }
}
