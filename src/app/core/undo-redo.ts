import { Injectable } from '@angular/core';
import { Template } from '../models/template';

@Injectable({providedIn:'root'})
export class UndoRedoService {
  private undoStack: Template[] = [];
  private redoStack: Template[] = [];
  readonly MAX = 50;

  push(snapshot: Template){
    this.undoStack.push(structuredClone(snapshot));
    if (this.undoStack.length > this.MAX) this.undoStack.shift();
    this.redoStack = [];
  }

  undo(current: Template){ if(!this.undoStack.length) return null;
    this.redoStack.push(structuredClone(current));
    return this.undoStack.pop()!;
  }

  redo(current: Template){ if(!this.redoStack.length) return null;
    this.undoStack.push(structuredClone(current));
    return this.redoStack.pop()!;
  }
}
