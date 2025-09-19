import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateService } from '../../core/template';
import { TextPropsComponent } from '../props/text-props/text-props';
import { BarcodePropsComponent } from '../props/barcode-props/barcode-props';
import { CanvasPropsComponent } from '../props/canvas-props/canvas-props'; // ✅
@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, TextPropsComponent, BarcodePropsComponent,CanvasPropsComponent], // ✅
  templateUrl: './properties-panel.html'
})
export class PropertiesPanelComponent {
  #templates = inject(TemplateService);
  selected$ = this.#templates.selectedId$;

  // compute kind by looking up current selected id in current template
  get kind(): 'text'|'barcode'|null {
    const id = this.#templates.selectedId$.value;
    if (!id) return null;
    const t = this.#templates.template$.value;
    const el = t.elements.find(e => e.id === id);
    if (!el) return null;
    if (el.type === 'text') return 'text';
    if (el.type === 'barcode') return 'barcode';
    return null;
  }
}
