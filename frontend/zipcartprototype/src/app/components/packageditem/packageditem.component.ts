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
import { Cartservices } from 'src/app/services/mockserver/cartservice/cartservices';
import { UpdatePackagedProduct } from 'src/app/classes/DTOs/UpdatePackagedProductRequestDTO';
import { ToastServices } from 'src/app/services/toastService/toast-services';
import { RemovePackagedProductRequest } from 'src/app/classes/DTOs/RemovePackagedProuctRequestDTO';

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
    private cartService: Cartservices,
    private toast: ToastServices,
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

  increaseProductQuantity(itemId: string) {
    let quantity = this.increaseQuantity(itemId);
    this.callServices(itemId, quantity);
  }

  decreaseProductQuantity(itemId: string) {
    let quantity = this.decreaseQuantity(itemId);
    if (quantity === 0) {
      return;
    }
    this.callServices(itemId, quantity);
  }
  /**
   * SERVICE CALLS TO UPDATE AND REMOVE PRODUCT
   * @param itemId
   * @param quantity
   */

  // SERVICE CALL TO UPDATE

  callServices(itemId: string, quantity: number) {
    let request = this.prepareRequest(itemId, quantity);
    this.cartService.updatePackagedProductQuantity(request).subscribe({
      next: (response) => {
        this.toast.showSuccess(response.result);
        this.cartService.getCartByCartId(this.cartInitResponse.cartId);
      },
      error: (err) => {
        const message = err?.error?.message || 'FAILED TO UPDATE ITEM';
        this.toast.showError(message);
      },
    });
  }
  // SERVICE CALL TO REMOVE

  removeProduct(itemId: string) {
    let request = this.prepareRequestForRemoval(itemId);
    this.cartService.removePackagedProduct(request).subscribe({
      next: (response) => {
        this.toast.showSuccess(response.result);
        // ✅ remove locally so UI updates
        this.products = this.products.filter(
          (product) => product.itemNumber !== itemId,
        );
        this.calculateProductTotalBeforeTaxes();
        this.cartService.getCartByCartId(this.cartInitResponse.cartId);
        this.dataSharing.exchangePackagedProductTotal((this.productTotal = 0));

        console.log(this.productTotal);
      },
      error: (err) => {
        const message = err?.error?.message || 'FAILED TO REMOVE ITEM';
        this.toast.showError(message);
      },
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
  /**
   * DATA PREPARATION
   */

  prepareRequestForRemoval(itemId: string): RemovePackagedProductRequest {
    return {
      cartId: this.cartInitResponse.cartId,
      itemId: itemId,
    };
  }
  prepareRequest(itemId: string, quantity: number): UpdatePackagedProduct {
    return {
      cartId: this.cartInitResponse.cartId,
      itemId: itemId,
      quantity: quantity,
    };
  }
  increaseQuantity(itemId: string): number {
    const product = this.products.find(
      (product) => product.itemNumber === itemId,
    );
    if (!product) {
      return 0;
    }

    const newQuantity = product.quantity + 1;
    product.quantity = newQuantity;

    this.calculateProductTotalBeforeTaxes();

    return newQuantity;
  }

  decreaseQuantity(itemId: string): number {
    const product = this.products.find(
      (product) => product.itemNumber === itemId,
    );
    if (!product) {
      return 0;
    }

    const newQuantity = product.quantity - 1;

    if (newQuantity < 0) {
      return product.quantity;
    }
    if (newQuantity === 0) {
      this.alertService.showAlert(
        'PRODUCT BELOW ZERO',
        'IF YOU WISH TO REMOVE THE ITEM FROM CART. PRESS REMOVE BUTTON',
        ['OK'],
      );
      return product.quantity;
    }
    product.quantity = newQuantity;

    this.calculateProductTotalBeforeTaxes();

    return newQuantity;
  }
}
