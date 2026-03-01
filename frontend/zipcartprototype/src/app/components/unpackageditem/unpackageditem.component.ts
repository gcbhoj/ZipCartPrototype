import { Component, OnInit } from '@angular/core';
import { UnPackagedProduct } from 'src/app/classes/UnPackagedProduct';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-unpackageditem',
  templateUrl: './unpackageditem.component.html',
  styleUrls: ['./unpackageditem.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonAvatar,
  ],
})
export class UnpackageditemComponent implements OnInit {
  cartId: string | null = '';
  products: UnPackagedProduct[] = [];
  constructor(private dataSharing: Datasharing) {}

  ngOnInit() {
    this.receiveCartId();
  }

  receiveCartId() {
    this.dataSharing.currentCartId.subscribe((data) => {
      this.cartId = data;
      this.receiveUnPackagedProducts();
    });
  }

  receiveUnPackagedProducts() {
    this.dataSharing.unPackagedProduct.subscribe((data) => {
      this.products = data;
    });
  }
}
