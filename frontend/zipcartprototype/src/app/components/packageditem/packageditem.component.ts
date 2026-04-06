import { ExploreContainerComponent } from './../../explore-container/explore-container.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PackagedProduct } from 'src/app/classes/Models/PackagedProduct';
import { CommonModule } from '@angular/common';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';
import { AlertServices } from 'src/app/services/alertService/alert-services';
import { ToastServices } from 'src/app/services/toastService/toast-services';
import { PackagedProductRequests } from 'src/app/classes/DTOs/PackagedProductRequests';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from 'src/app/services/springServices/cartServices/cart-service';

@Component({
  selector: 'app-packageditem',
  templateUrl: './packageditem.component.html',
  styleUrls: ['./packageditem.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PackageditemComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  productTotal: number = 0;
  total: number = 0;

  cartInitResponse: StartShoppingResponse = {
    cartId: '',
    retailerName: '',
    budget: 0,
    message: '',
  };
  //initializing the products array to store received products
  products: PackagedProduct[] = [];

  apiRequests: PackagedProductRequests = {
    cartId: '',
    itemId: '',
  };
  constructor(
    private dataSharing: Datasharing,
    private calculator: CalculatorService,
    private alertService: AlertServices,
    private toast: ToastServices,
    private cartServices: CartService,
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.receiveCartInitResponse();
    this.receivePackagedProducts();
  }
  /**
   * DATA SHARING COMPONENTS
   */

  // Receiving the packaged products
  receivePackagedProducts() {
    this.dataSharing.packagedProduct
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.products = data;

        this.calculateProductTotalBeforeTaxes();
      });
  }

  // receiving cart initialization response
  receiveCartInitResponse() {
    this.dataSharing.startShoppingResponseDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.cartInitResponse = data;
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
    this.prepareData(itemId);
    this.cartServices
      .increasePackagedProductQuantity(this.apiRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toast.showSuccess(response.result);
          console.log(response.result);
          this.cartServices.getCartByCartId(this.cartInitResponse.cartId);
        },
        error: (err) => {
          const message = err?.error?.message || 'Unable to Increase Quantity';
          this.toast.showError(message);
        },
      });
  }
  decreaseProductQuantity(itemId: string) {
    const product = this.products.find((p) => p.itemNumber === itemId);
    if (!product) return;

    if (product.quantity > 1) {
      this.prepareData(product.itemNumber);
      this.cartServices
        .decreasePackagedProductQuantity(this.apiRequests)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toast.showSuccess(response.result);
            this.cartServices.getCartByCartId(this.cartInitResponse.cartId);
          },
          error: (err) => {
            const message =
              err?.error?.message || 'Unable to Decrease Quantity';
            this.toast.showError(message);
          },
        });
    }

    if (product.quantity === 1) {
      this.alertService.showAlert(
        'REMOVE PRODUCT',
        'USE THE REMOVE BUTTON TO REMOVE THE PRODUCT',
      );
      product.quantity = 1;
    }
  }

  removePackagedProduct(itemId: string) {
    this.prepareData(itemId);
    this.cartServices
      .removePackagedProduct(this.apiRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toast.showSuccess(response.result);
          this.cartServices.getCartByCartId(this.cartInitResponse.cartId);
        },
        error: (err) => {
          const message = err?.error?.message || 'Unable to Remove Product';
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
    } else {
      this.productTotal = 0;
    }
    this.shareProductsTotal();
  }

  calculateTotal(unitPrice: number, quantity: number): number {
    return this.calculator.calculateTotalProductPrice(unitPrice, quantity);
  }

  /**
   * DATA PREPRATION FOR TRANSFER
   */
  prepareData(itemId: string) {
    this.apiRequests.cartId = this.cartInitResponse.cartId;
    this.apiRequests.itemId = itemId;
  }
}
