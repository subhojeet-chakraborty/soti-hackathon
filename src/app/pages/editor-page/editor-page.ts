import { Component } from '@angular/core';
import { PropertiesPanelComponent } from '../../editor/properties-panel/properties-panel';
import { CanvasComponent } from '../../editor/canvas/canvas';
import { ToolboxComponent } from '../../editor/toolbox/toolbox';
import { TopbarComponent } from '../../editor/topbar/topbar';

@Component({
  selector: 'app-editor-page',
  imports: [TopbarComponent, ToolboxComponent, CanvasComponent, PropertiesPanelComponent],
  templateUrl: './editor-page.html',
  styleUrl: './editor-page.css'
})
export class EditorPage {

}
