import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { WeighProductResponse } from 'src/app/classes/DTOs/WeighProductResponseDTO';

@Component({
  selector: 'app-live-weight',
  templateUrl: './live-weight.component.html',
  styleUrls: ['./live-weight.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class LiveWeightComponent implements OnInit {
  response: WeighProductResponse = {
    itemNumber: '12345',
    productName: 'apple',
    liveWeight: 500,
    unitPrice: 2,
    imageURL: '/assets/images/trialImages/image1.jpg',
  };
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }
}
