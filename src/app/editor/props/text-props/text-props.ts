import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateService } from '../../../core/template';
import { TextElement } from '../../../models/elements';

@Component({
  selector: 'app-text-props',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-props.html'
})
export class TextPropsComponent implements OnInit {
  @Input() id!: string;
  #templates = inject(TemplateService);

  el?: TextElement;

  ngOnInit() {
    // simple lookup on init; for MVP, re-open panel after changes
    const t = this.#templates.template$.value;
    this.el = t.elements.find(e => e.id === this.id && e.type === 'text') as TextElement | undefined;
  }

  patch(p: Partial<TextElement>) {
    if (!this.el) return;
    this.#templates.updateElement(this.el.id, p as any);
  }

  setContent(v: string) {
    if (!this.el) return;
    // lock content if dynamic
    if (this.el.binding?.mode === 'dynamic') return;
    this.patch({ content: v } as any);
  }

  setFontSize(v: number) {
    if (!this.el) return;
    this.patch({ style: { ...this.el.style, fontSize: Number(v) } } as any);
  }

  setColor(v: string) {
    if (!this.el) return;
    this.patch({ style: { ...this.el.style, color: v } } as any);
  }

  setBindingMode(mode: 'static'|'dynamic') {
    if (!this.el) return;
    const key = mode === 'dynamic' ? (this.el.binding?.key || `text_${this.el.id}`) : undefined;
    this.patch({ binding: { mode, key } as any });
  }

  setBindingKey(v: string) {
    if (!this.el) return;
    this.patch({ binding: { mode: 'dynamic', key: v } as any });
  }
}
