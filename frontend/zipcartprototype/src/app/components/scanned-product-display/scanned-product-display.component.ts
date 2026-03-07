import { Component, OnInit } from '@angular/core';
import { PackagedProductInformation } from 'src/app/classes/PackagedProductInformation';
import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
} from '@ionic/angular/standalone';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scanned-product-display',
  templateUrl: './scanned-product-display.component.html',
  styleUrls: ['./scanned-product-display.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonAccordion,
    IonAccordionGroup,
    CommonModule,
  ],
})
export class ScannedProductDisplayComponent implements OnInit {
  product!: PackagedProductInformation;
  productQuantity: number = 0;
  constructor(private dataSharing: Datasharing) {}

  ngOnInit() {
    this.receiveProductInfo();
  }

  receiveProductInfo() {
    this.dataSharing.packagedProductInfo.subscribe((data) => {
      if (data) {
        this.product = data;
      }
    });
  }
}
