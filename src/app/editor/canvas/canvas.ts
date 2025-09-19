import { AfterViewInit, Component, ElementRef, ViewChild, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateService } from '../../core/template';
import * as fabric from 'fabric';
import JsBarcode from 'jsbarcode';
import { ElementBase, TextElement, BarcodeElement } from '../../models/elements';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.html',
  styleUrls: ['./canvas.css']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('fabricCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wrap', { static: true }) wrapRef!: ElementRef<HTMLDivElement>;
  #templates = inject(TemplateService);

  private canvas!: fabric.Canvas;
  private sub!: Subscription;
  private ro?: ResizeObserver;

  // Bounds: min 200×200, max A4 @ 300DPI = ~2480×3508 px
  readonly MIN_W = 200;
  readonly MIN_H = 200;
  readonly MAX_W = 600;
  readonly MAX_H = 800;

  canvasWidth = 900;
  canvasHeight = 600;

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      backgroundColor: '#FFFFFF',
      selection: true,
      preserveObjectStacking: true,
    });

    // Observe wrapper size changes (user drags corner)
    this.ro = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const target = entry.target as HTMLDivElement;
      const bounds = target.getBoundingClientRect();

      let w = Math.round(bounds.width);
      let h = Math.round(bounds.height);

      // clamp to min/max
      w = Math.max(this.MIN_W, Math.min(this.MAX_W, w));
      h = Math.max(this.MIN_H, Math.min(this.MAX_H, h));

      // Only update if changed (avoid loops)
      if (w !== this.canvasWidth || h !== this.canvasHeight) {
        this.canvasWidth = w;
        this.canvasHeight = h;

        // Update Fabric + state
        this.canvas.setWidth(w);
        this.canvas.setHeight(h);
        const bg = this.#templates.template$.value.canvas.backgroundColor ?? '#FFFFFF';
        (this.canvas as any).backgroundColor = bg;

        // this.canvas.setBackgroundColor(bg, this.canvas.requestRenderAll.bind(this.canvas));

        this.#templates.updateCanvas({ width: w, height: h });
      }
    });
    this.ro.observe(this.wrapRef.nativeElement);

    // Sync from state (programmatic updates)
    this.sub = this.#templates.template$.subscribe(t => {
      // When state changes, update wrapper and canvas
      const w = Math.max(this.MIN_W, Math.min(this.MAX_W, t.canvas.width));
      const h = Math.max(this.MIN_H, Math.min(this.MAX_H, t.canvas.height));

      this.canvasWidth = w;
      this.canvasHeight = h;

      this.wrapRef.nativeElement.style.width = `${w}px`;
      this.wrapRef.nativeElement.style.height = `${h}px`;

      this.canvas.setWidth(w);
      this.canvas.setHeight(h);

      const bg = t.canvas.backgroundColor ?? '#FFFFFF';
      (this.canvas as any).backgroundColor = bg;

     

      this.renderFromState(t.elements);
    });

    // Selection -> service
    this.canvas.on('selection:created', (e: any) =>
      this.#templates.select((e.selected?.[0] as any)?.data?.id ?? null)
    );
    this.canvas.on('selection:updated', (e: any) =>
      this.#templates.select((e.selected?.[0] as any)?.data?.id ?? null)
    );
    this.canvas.on('selection:cleared', () => this.#templates.select(null));

    // Push back modifications
    const onModify = (o: fabric.Object) => {
      const id = (o as any).data?.id as string | undefined;
      if (!id) return;
      this.#templates.updateElement(id, {
        position: { x: o.left ?? 0, y: o.top ?? 0 },
        size: {
          width: (o.width ?? 0) * (o.scaleX ?? 1),
          height: (o.height ?? 0) * (o.scaleY ?? 1),
        },
        rotation: o.angle ?? 0,
      } as any);
      o.set({ scaleX: 1, scaleY: 1 });
    };
    this.canvas.on('object:modified', (e: any) => e?.target && onModify(e.target as fabric.Object));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.ro?.disconnect();
    this.canvas?.dispose();
  }

  private renderFromState(elements: ElementBase[]) {
    this.canvas.clear();
    const bg = this.#templates.template$.value.canvas.backgroundColor ?? '#FFFFFF';
    (this.canvas as any).backgroundColor = bg;

    

    for (const el of elements) {
      if (el.type === 'text') this.addTextFabric(el as TextElement);
      if (el.type === 'barcode') this.addBarcodeFabric(el as BarcodeElement);
    }
    this.canvas.requestRenderAll();
  }

  private addTextFabric(el: TextElement) {
    const t = new fabric.Textbox(el.content || '', {
      left: el.position.x,
      top: el.position.y,
      width: el.size.width,
      height: el.size.height,
      angle: el.rotation ?? 0,
      fill: el.style.color ?? '#111827',
      fontFamily: el.style.fontFamily,
      fontWeight: String(el.style.fontWeight ?? 400),
      fontSize: el.style.fontSize,
      textAlign: el.style.alignment ?? 'left',
      editable: !(el.binding?.mode === 'dynamic'),
    });
    (t as any).data = { id: el.id, type: el.type };
    this.canvas.add(t);
  }

  private addBarcodeFabric(el: BarcodeElement) {
    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.floor(el.size.width));
    off.height = Math.max(1, Math.floor(el.size.height));
    const display = el.showHumanReadable !== false;

    try {
      JsBarcode(off, el.barcodeId || 'PREVIEW-123456', {
        format: el.barcodeType.replace('-', ''),
        width: Math.max(1, Math.floor(el.size.width / 110)),
        height: Math.max(20, off.height - (display ? 16 : 0)),
        displayValue: display,
      } as any);
    } catch { /* preview-safe */ }

  //   fabric.Image.fromURL(off.toDataURL('image/png'), (img: fabric.Image) => {
  //     if (!img) return;
  //     img.set({ left: el.position.x, top: el.position.y, angle: el.rotation ?? 0, selectable: true });
  //     img.scaleToWidth(el.size.width);
  //     img.scaleToHeight(el.size.height);
  //     (img as any).data = { id: el.id, type: el.type };
  //     this.canvas.add(img);
  //   });
  // }
}}
