import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-barcode-display',
  templateUrl: './barcode-display.component.html',
  styleUrls: ['./barcode-display.component.scss'],
  imports: [IonicModule],
})
export class BarcodeDisplayComponent implements OnInit {

  @Input() finalImageSrc !:string
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  /**
   * MODAL
   *
   */

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
