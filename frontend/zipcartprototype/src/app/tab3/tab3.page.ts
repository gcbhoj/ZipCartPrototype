import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LiveWeightComponent } from '../components/live-weight/live-weight.component';
import { BarcodeDisplayComponent } from "../components/barcode-display/barcode-display.component";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonicModule, BarcodeDisplayComponent],
})
export class Tab3Page {
  constructor() {}
}
