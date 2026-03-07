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
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';

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
  taxAmount: number = 0;
  totalAmount: number = 0;
  constructor(
    private dataSharing: Datasharing,
    private calculator: CalculatorService,
  ) {}

  ngOnInit() {
    this.receiveProductInfo();
  }

  receiveProductInfo() {
    this.dataSharing.packagedProductInfo.subscribe((data) => {
      if (data) {
        this.product = data;
        this.taxAmount = this.calculator.calculateTaxAmount(this.product.price);
        this.totalAmount = this.calculator.calculateTotalAmount(
          this.taxAmount,
          this.product.price,
        );
      }
    });
  }
}
