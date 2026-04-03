import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnPackagedProduct } from 'src/app/classes/Models/UnPackagedProduct';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { CommonModule } from '@angular/common';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';

@Component({
  selector: 'app-unpackageditem',
  templateUrl: './unpackageditem.component.html',
  styleUrls: ['./unpackageditem.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class UnpackageditemComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  cartInitResponse: StartShoppingResponse = {
    cartId: '',
    retailerName: '',
    budget: 0,
    message: '',
  };
  //Initializing unpackaed array to received shared data from cart page
  products: UnPackagedProduct[] = [];

  productTotal: number = 0;
  constructor(
    private dataSharing: Datasharing,
    private calculator: CalculatorService,
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.receiveCartInitResponse();
    this.receiveUnPackagedProducts();
  }

  /**
   * DATA SHARING
   */

  // Receiving the packaged products
  receiveUnPackagedProducts() {
    this.dataSharing.unPackagedProduct
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.products = data;
        console.log(this.products);
        this.calculateProductTotalBeforeTaxes();
        console.log('Unpackaged Products Total:', this.productTotal);
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

  // sharing unpackaed product total
  shareProductsTotal() {
    this.dataSharing.exchangeUnPackagedProductTotal(this.productTotal);
  }
  /**
   * TOTAL CALCULATIONS
   */

  calculateProductTotalBeforeTaxes() {
    if (this.products && this.products.length > 0) {
      this.productTotal = this.calculator.calculateProductTotalWithoutTaxes(
        this.products,
      );
      this.shareProductsTotal();
    }
  }

  calculateTotal(weight: number, unitPrice: number): number {
    return this.calculator.calculateTotalProductPrice(unitPrice, weight);
  }
}
