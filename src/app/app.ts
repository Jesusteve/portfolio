import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio');

  imagenAmpliada: string | null = null;

  // Ampliar la imagen al hacer clic
  abrirImagen(rutaImg: string) {
    this.imagenAmpliada = rutaImg;
  }

  // Volver a la normalidad
  cerrarImagen() {
    this.imagenAmpliada = null;
  }
}
