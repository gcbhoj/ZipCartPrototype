/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
*/
import { Component } from '@angular/core';
import { IONIC_UI } from 'src/UIImports';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IONIC_UI],
})
export class Tab3Page {
  constructor() {}
}
