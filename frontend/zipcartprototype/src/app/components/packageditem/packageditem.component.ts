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
import { IncreaseProductQuantity } from 'src/app/classes/DTOs/IncreaseProductQuantityDTO';
import { AlertServices } from 'src/app/services/alertService/alert-services';

@Component({
  selector: 'app-packageditem',
  templateUrl: './packageditem.component.html',
  styleUrls: ['./packageditem.component.scss'],
  standalone: true,
  imports: [CommonModule, IONIC_UI],
})
export class PackageditemComponent implements OnInit {
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
    private alertService: AlertServices,
  ) {}

  ngOnInit() {
    this.receiveCartInitResponse();
  }
  /**
   * DATA SHARING COMPONENTS
   */

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
  // sharing the total amount from the packaged products in cart
  shareProductsTotal() {
    this.dataSharing.exchangePackagedProductTotal(this.productTotal);
  }
  /**
   * HANDLING INCREASE AND DECREASE OF PRODUCT QUANTITY
   */

  increaseProductQuantity() {
    this.products.forEach((product) => {
      if ('quantity' in product) {
        product.quantity++;
        this.calculateProductTotalBeforeTaxes();
      }
    });
  }

  decreaseProductQuantity() {
    this.products.forEach((product) => {
      if ('quantity' in product) {
        product.quantity--;
        if (product.quantity === 1) {
          this.alertService.showProductRemovalAlert(
            () => {
              //TODO: IMPLEMENT REMOVE LOGIC AND IMPLEMENT HERE
              console.log('OK HAS BEEN PRESSED');
            },
            () => {
              product.quantity = 1;
            },
          );
        }
        this.calculateProductTotalBeforeTaxes();
      }
    });
  }

  /**
   * CALCULATOR SERVICES
   */

  calculateProductTotalBeforeTaxes() {
    if (this.products && this.products.length > 0) {
      this.productTotal = this.calculator.calculateProductTotalWithoutTaxes(
        this.products,
      );
      this.shareProductsTotal();
    }
  }
}
