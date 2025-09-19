import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Template } from '../models/template';
import { ElementBase } from '../models/elements';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  readonly template$ = new BehaviorSubject<Template>(this.empty());
  readonly selectedId$ = new BehaviorSubject<string | null>(null);
  readonly dirty$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  loadNew(): void {
    this.template$.next(this.empty());
  }

  select(id: string | null){ this.selectedId$.next(id); }

  mutate(mutator: (t: Template) => void) {
    const t = structuredClone(this.template$.value);
    mutator(t);
    t.updatedAt = new Date().toISOString();
    this.template$.next(t);
    this.dirty$.next(true);
  }

  addText() {
    this.mutate(t => {
      const id = `el_${crypto.randomUUID?.() ?? uuidv4()}`;
      t.elements.push({
        id, type: 'text',
        position: {x: 20, y: 20},
        size: {width: 360, height: 40},
        rotation: 0, zIndex: 1, locked: false, visible: true,
        content: '',
        style: {fontFamily:'Inter', fontSize:16, fontWeight:600, color:'#111827', alignment:'left'},
        binding: { mode:'static' }
      } as any);
    });
  }

  addBarcode() {
    this.mutate(t => {
      const id = `el_${crypto.randomUUID?.() ?? uuidv4()}`;
      t.elements.push({
        id, type: 'barcode',
        barcodeType: 'Code128',
        barcodeId: '', // force user to set in properties
        position: {x: 20, y: 90},
        size: {width: 300, height: 60},
        rotation: 0, zIndex: 1, locked: false, visible: true,
        showHumanReadable: true
      } as any);
    });
  }

  updateElement(id: string, patch: Partial<ElementBase>) {
    this.mutate(t => {
      const i = t.elements.findIndex(e => e.id === id);
      if (i >= 0) t.elements[i] = { ...t.elements[i], ...patch } as any;
    });
  }

  deleteSelected() {
    const id = this.selectedId$.value;
    if (!id) return;
    this.mutate(t => { t.elements = t.elements.filter(e => e.id !== id); });
    this.select(null);
  }

  save() {
    const payload = this.template$.value;
    return this.http.post('/api/templates', payload); // replace with your endpoint
  }

  private empty(): Template {
    return {
      templateId: `temp_${crypto.randomUUID?.() ?? uuidv4()}`,
  name: 'Untitled',
  canvas: { width: 800, height: 400, unit: 'px', backgroundColor: '#FFFFFF' }, // ✅
  elements: [],
  fields: [],
  version: 1
    };
  }

  updateCanvas(patch: Partial<Template['canvas']>) {
  this.mutate(t => {
    t.canvas = { ...t.canvas, ...patch };
  });
}}
