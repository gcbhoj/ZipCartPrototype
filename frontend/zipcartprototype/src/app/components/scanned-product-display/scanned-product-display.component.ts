/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { PackagedProductInformation } from 'src/app/classes/Models/PackagedProductInformation';
import { IONIC_UI } from 'src/UIImports';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { CommonModule } from '@angular/common';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';

@Component({
  selector: 'app-scanned-product-display',
  templateUrl: './scanned-product-display.component.html',
  styleUrls: ['./scanned-product-display.component.scss'],
  standalone: true,
  imports: [IONIC_UI, CommonModule],
})
export class ScannedProductDisplayComponent implements OnInit {
  //Initializing the PackedProductInformation to map with incoming scanned result
  product!: PackagedProductInformation;
  //Initializing the tax amount variable
  taxAmount: number = 0;
  //Initializing total amount
  totalAmount: number = 0;

  //Initializing  item id to be passed to the
  selectedPackagedProductItemId: string = '';

  constructor(
    private dataSharing: Datasharing,
    private calculator: CalculatorService,
  ) {}

  ngOnInit() {
    this.receiveProductInfo();
  }

  //Receiving the product information shared by the scan items page.
  receiveProductInfo() {
    this.dataSharing.packagedProductInfo.subscribe((data) => {
      if (data) {
        this.product = data;
        this.taxAmount = this.calculator.calculateTaxAmount(this.product.price);
        this.totalAmount = this.calculator.performAddition(
          this.taxAmount,
          this.product.price,
        );
        this.selectedPackagedProductItemId = this.product.itemNumber;
      }
    });
  }
}
