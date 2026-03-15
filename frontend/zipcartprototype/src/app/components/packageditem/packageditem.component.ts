/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { PackagedProduct } from 'src/app/classes/Models/PackagedProduct';
import { IONIC_UI } from 'src/UIImports';
import { CommonModule } from '@angular/common';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';

@Component({
  selector: 'app-packageditem',
  templateUrl: './packageditem.component.html',
  styleUrls: ['./packageditem.component.scss'],
  standalone: true,
  imports: [CommonModule, IONIC_UI],
})
export class PackageditemComponent implements OnInit {
  //TODO: SHARE THE PACKAGED PRODUCT TOTAL TO CART COMPONENT
  productTotal: number = 0;

  cartInitResponse: StartShoppingResponse = {
    cartId: '',
    retailerName: '',
    budget: 0,
    message: '',
  };
  //initializing the products array to store received products
  products: PackagedProduct[] = [];
  constructor(
    private dataSharing: Datasharing,
    private calculator: CalculatorService,
  ) {}

  ngOnInit() {
    this.receiveCartInitResponse();
  }

  // Receiving the packaged products
  receivePackagedProducts() {
    this.dataSharing.packagedProduct.subscribe((data) => {
      this.products = data;

      this.calculateProductTotalBeforeTaxes();
    });
  }

  // receiving cart initialization response
  receiveCartInitResponse() {
    this.dataSharing.startShoppingResponseDetails.subscribe((data) => {
      if (data) {
        this.cartInitResponse = data;
        this.receivePackagedProducts();
      }
    });
  }

  calculateProductTotalBeforeTaxes() {
    if (this.products && this.products.length > 0) {
      this.productTotal = this.calculator.calculateProductTotalWithoutTaxes(
        this.products,
      );
      this.shareProductsTotal();
    }
  }

  shareProductsTotal() {
    this.dataSharing.exchangePackagedProductTotal(this.productTotal);
  }
}
