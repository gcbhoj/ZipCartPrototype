import { Component, OnInit } from '@angular/core';
import { PackagedProduct } from 'src/app/classes/PackagedProduct';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Datasharing } from 'src/app/services/datasharing/datasharing';

@Component({
  selector: 'app-packageditem',
  templateUrl: './packageditem.component.html',
  styleUrls: ['./packageditem.component.scss'],
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
export class PackageditemComponent implements OnInit {
  cartId: string | null = '';
  products: PackagedProduct[] = [];
  constructor(private dataSharing: Datasharing) {}

  ngOnInit() {
    this.receiveCartId();
  }

  // Receiving the cart id IF IN CASE NEEDED
  receiveCartId() {
    this.dataSharing.currentCartId.subscribe((data) => {
      this.cartId = data;
      this.receivePackagedProducts();
    });
  }

  // Receiving the packaged products
  receivePackagedProducts() {
    this.dataSharing.packagedProduct.subscribe((data) => {
      this.products = data;
    });
  }
}
