import { Component, signal, HostListener } from '@angular/core';
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
  private mouseX = 0;
  private mouseY = 0;
  private scrollTimeout: any;
  private removeFixTimeout: any;
  private pointerInside = true; // true cuando el cursor está dentro de la ventana

  // Ampliar la imagen al hacer clic
  abrirImagen(rutaImg: string) {
    this.imagenAmpliada = rutaImg;
  }

  // Volver a la normalidad
  cerrarImagen() {
    this.imagenAmpliada = null;
  }

  // Guardamos la posición del ratón constantemente
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  // Detectar salida/entrada del cursor de la ventana
  @HostListener('window:mouseleave', [])
  onWindowMouseLeave() {
    this.pointerInside = false;
  }

  @HostListener('window:mouseenter', [])
  onWindowMouseEnter() {
    this.pointerInside = true;
    // Si entró el cursor y había aplicado la clase por scroll, retirarla
    document.documentElement.classList.remove('scroll-fix');
    if (this.removeFixTimeout) {
      clearTimeout(this.removeFixTimeout);
      this.removeFixTimeout = null;
    }
  }

  // Al hacer scroll, recalculamos y aplicamos la corrección si hace falta
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Espera a que el usuario pare de hacer scroll
    this.scrollTimeout = setTimeout(() => {
      // Si el puntero está fuera de la ventana, aplica la clase global que desactiva hover/animaciones
      if (!this.pointerInside) {
        document.documentElement.classList.add('scroll-fix');
        // quitar la clase pasado un tiempo prudente para restaurar interactividad
        if (this.removeFixTimeout) clearTimeout(this.removeFixTimeout);
        this.removeFixTimeout = setTimeout(() => {
          document.documentElement.classList.remove('scroll-fix');
          this.removeFixTimeout = null;
        }, 220); // 200-300ms suele ser suficiente
      } else {
        // Si el cursor está dentro, asegúrate de no aplicar ningún fix
        document.documentElement.classList.remove('scroll-fix');
      }
    }, 120); // ajustable: tiempo tras el que consideramos "se ha parado"
  }
}
