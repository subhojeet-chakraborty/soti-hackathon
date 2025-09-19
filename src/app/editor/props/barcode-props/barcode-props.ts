import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateService } from '../../../core/template';
import { BarcodeElement } from '../../../models/elements';

@Component({
  selector: 'app-barcode-props',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barcode-props.html'
})
export class BarcodePropsComponent implements OnInit {
  @Input() id!: string;
  #templates = inject(TemplateService);

  el?: BarcodeElement;
  types: Array<BarcodeElement['barcodeType']> = ['Code128','Code39','EAN-13','UPC-A'];
  error = '';

  ngOnInit() {
    const t = this.#templates.template$.value;
    this.el = t.elements.find(e => e.id === this.id && e.type === 'barcode') as BarcodeElement | undefined;
  }

  patch(p: Partial<BarcodeElement>) {
    if (!this.el) return;
    this.#templates.updateElement(this.el.id, p as any);
  }

  setId(v: string) {
    this.error = v.trim() ? '' : 'Barcode ID is required';
    this.patch({ barcodeId: v });
  }

  setType(v: string) {
    this.patch({ barcodeType: v as any });
  }

  setHumanReadable(v: boolean) {
    this.patch({ showHumanReadable: v });
  }
}
