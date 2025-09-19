import type { ElementBase, FieldDescriptor } from './elements';

export interface Template {
  templateId: string;
  name: string;
  description?: string;
  canvas: {
    width: number;
    height: number;
    unit: 'px'|'mm'|'in';
    backgroundColor?: string;     // ✅ add this
  };
  elements: ElementBase[];
  fields: FieldDescriptor[];
  thumbnailBase64?: string;
  version?: number;
  updatedAt?: string;
}
