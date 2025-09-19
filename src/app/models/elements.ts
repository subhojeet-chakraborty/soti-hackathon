export type ElementBase = TextElement | BarcodeElement | QrElement | ShapeElement | ImageElement | BarcodeTextElement;

export interface BaseProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  zIndex?: number;
  locked?: boolean;
  visible?: boolean;
}

export interface TextElement extends BaseProps {
  type: 'text';
  content: string;
  style: {
    fontFamily: string;
    fontSize: number;
    fontWeight?: number;
    italic?: boolean;
    color?: string;
    alignment?: 'left'|'center'|'right';
  };
  binding?: { mode: 'static'|'dynamic'; key?: string };
}

export interface BarcodeElement extends BaseProps {
  type: 'barcode';
  barcodeType: 'Code128'|'Code39'|'EAN-13'|'UPC-A';
  barcodeId: string;
  showHumanReadable?: boolean;
}

export interface QrElement extends BaseProps {
  type: 'qr';
  qrId?: string;
  eccLevel?: 'L'|'M'|'Q'|'H';
}

export interface ShapeElement extends BaseProps {
  type: 'shape';
  shapeType: 'rectangle'|'circle'|'line';
  style: { fillColor?: string; strokeColor?: string; strokeWidth?: number; lineStyle?: 'solid'|'dashed' };
}

export interface ImageElement extends BaseProps {
  type: 'image';
  src: string;
  alt?: string;
}

export interface BarcodeTextElement extends BaseProps {
  type: 'barcode-text';
  linkedBarcodeId: string;
}

export interface FieldDescriptor {
  key: string;
  label?: string;
  editable: boolean;
  elementId: string;
}
