import { Injectable, effect, inject } from '@angular/core';
import { TemplateService } from './template';
import { debounceTime, interval, withLatestFrom, filter } from 'rxjs';

@Injectable({providedIn:'root'})
export class AutosaveService {
  #templates = inject(TemplateService);

  constructor(){
    // Debounced saves (2s after any change)
    this.#templates.template$
      .pipe(debounceTime(2000))
      .subscribe(t => this.persist(t));

    // Safety periodic save (8s) if dirty
    interval(8000).pipe(
      withLatestFrom(this.#templates.dirty$),
      filter(([_, dirty]) => dirty)
    ).subscribe(() => this.persist(this.#templates.template$.value));
  }

  private persist(t: any){
    const key = `labelDesigner:draft:${t.templateId}`;
    localStorage.setItem(key, JSON.stringify({ ...t, lastSavedAt: Date.now() }));
    this.#templates.dirty$.next(false);
  }
}
