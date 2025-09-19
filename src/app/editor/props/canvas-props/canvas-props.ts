import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateService } from '../../../core/template';

@Component({
  selector: 'app-canvas-props',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canvas-props.html'
})
export class CanvasPropsComponent {
  #templates = inject(TemplateService);

  get w() { return this.#templates.template$.value.canvas.width; }
  get h() { return this.#templates.template$.value.canvas.height; }
  get bg(){ return this.#templates.template$.value.canvas.backgroundColor ?? '#FFFFFF'; }

  // keep bounds simple; you asked for 200 and 400—these work as examples; the inputs accept any number in range
  readonly MIN = 200;
  readonly MAX = 4000;

  setW(v: number){
    const width = Math.max(this.MIN, Math.min(this.MAX, Math.floor(v || this.MIN)));
    this.#templates.updateCanvas({ width });
  }
  setH(v: number){
    const height = Math.max(this.MIN, Math.min(this.MAX, Math.floor(v || this.MIN)));
    this.#templates.updateCanvas({ height });
  }
  setBg(v: string){
    this.#templates.updateCanvas({ backgroundColor: v || '#FFFFFF' });
  }
}
