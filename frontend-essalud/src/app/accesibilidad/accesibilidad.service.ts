import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccesibilidadService {
  tamanoFuente = signal<number>(100);
  altoContraste = signal<boolean>(false);
  invertirColor = signal<boolean>(false);
  modoDaltonismo = signal<boolean>(false);
  lecturaActiva = signal<boolean>(false);

  aumentarTexto(): void {
    const nuevo = Math.min(this.tamanoFuente() + 10, 140);
    this.tamanoFuente.set(nuevo);
    document.documentElement.style.fontSize = `${nuevo}%`;
    console.log('Tamaño aplicado:', nuevo); // Revisa la consola F12 para ver si entra aquí
  }

  disminuirTexto(): void {
    const nuevo = Math.max(this.tamanoFuente() - 10, 90);
    this.tamanoFuente.set(nuevo);
    document.documentElement.style.fontSize = `${nuevo}%`;
  }

  toggleAltoContraste(): void {
    const estado = !this.altoContraste();
    this.altoContraste.set(estado);
    document.body.classList.toggle('acc-alto-contraste', estado);
  }

  toggleInvertirColor(): void {
    const estado = !this.invertirColor();
    this.invertirColor.set(estado);
    document.body.classList.toggle('acc-invertir-color', estado);
  }

  toggleDaltonismo(): void {
    const estado = !this.modoDaltonismo();
    this.modoDaltonismo.set(estado);
    document.body.classList.toggle('acc-daltonismo', estado);
  }

  leerPantalla(): void {
    if (!('speechSynthesis' in window)) return;

    if (this.lecturaActiva()) {
      window.speechSynthesis.cancel();
      this.lecturaActiva.set(false);
      return;
    }

    const contenido = document.querySelector('main')?.innerText || document.body.innerText;
    const mensaje = new SpeechSynthesisUtterance(contenido);
    mensaje.lang = 'es-PE';
    mensaje.rate = 1.0;

    mensaje.onend = () => this.lecturaActiva.set(false);
    mensaje.onerror = () => this.lecturaActiva.set(false);

    this.lecturaActiva.set(true);
    window.speechSynthesis.speak(mensaje);
  }

  restablecerTodo(): void {
    this.tamanoFuente.set(100);
    this.altoContraste.set(false);
    this.invertirColor.set(false);
    this.modoDaltonismo.set(false);
    this.lecturaActiva.set(false);

    document.documentElement.style.fontSize = '100%';
    document.body.classList.remove('acc-alto-contraste', 'acc-invertir-color', 'acc-daltonismo');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
