import { Component, inject } from '@angular/core';
import { TemplateService } from '../../core/template';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbox',
  standalone: true, imports:[CommonModule],
  templateUrl: './toolbox.html'
})
export class ToolboxComponent {
  #templates = inject(TemplateService);
  add(kind:'text'|'barcode'){
    if (kind === 'text') this.#templates.addText();
    else this.#templates.addBarcode();
  }
}
