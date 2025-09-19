import { Component, inject } from '@angular/core';
import { TemplateService } from '../../core/template';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topbar.html'
})
export class TopbarComponent {
  #templates = inject(TemplateService);
  name = this.#templates.template$.value.name;
  saveHint = 'Autosaves every few seconds';

  save(){
    this.#templates.mutate(t => t.name = this.name);
    this.#templates.save().subscribe(() => this.saveHint = 'Saved ✓');
  }
  preview(){ /* open modal + canvas.toDataURL in CanvasComponent (next step) */ }
}
