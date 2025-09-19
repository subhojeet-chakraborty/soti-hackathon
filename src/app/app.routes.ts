import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { EditorPage } from './pages/editor-page/editor-page';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'editor/new', component: EditorPage },
  { path: 'editor/:templateId', component: EditorPage },
];
