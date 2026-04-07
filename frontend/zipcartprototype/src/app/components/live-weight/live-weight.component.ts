import { AddWeighedProduct } from './../../classes/DTOs/AddWeighedProductDTO';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { WeighProductResponse } from 'src/app/classes/DTOs/WeighProductResponseDTO';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';
import { Datasharing } from 'src/app/services/datasharing/datasharing';

@Component({
  selector: 'app-live-weight',
  templateUrl: './live-weight.component.html',
  styleUrls: ['./live-weight.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class LiveWeightComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() liveCart!: WeighProductResponse;

  priceBeforeTax: number = 0;
  taxAmount: number = 0;
  totalAmount: number = 0;

  addProduct: AddWeighedProduct = {
    itemId: '',
    weight: 0,
    cartId: '',
  };

  cartInit: StartShoppingResponse = {
    cartId: '',
    retailerName: '',
    budget: 0,
    message: '',
  };
  constructor(
    private modalCtrl: ModalController,
    private calculator: CalculatorService,
    private dataSharing: Datasharing,
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.receiveCartId();
    if (this.liveCart) {
      this.calculateTaxes();
    }
  }

  /**
   * DATA SHARING
   */

  receiveCartId() {
    this.dataSharing.startShoppingResponseDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.cartInit = data;
        }
      });
  }

  /**
   *
   * MODAL BUTTON FUNCTIONALITIES
   */

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.addProduct = {
      itemId: this.liveCart.itemNumber,
      weight: this.liveCart.liveWeight,
      cartId: this.cartInit.cartId,
    };

    return this.modalCtrl.dismiss(this.addProduct, 'confirm');
  }

  /**
   * TAX CALCULATION
   */
  calculateTaxes() {
    this.priceBeforeTax = this.calculator.calculateTotalProductPrice(
      this.liveCart.unitPrice,
      this.liveCart.liveWeight,
    );
    this.taxAmount = this.calculator.calculateTaxAmount(this.priceBeforeTax);
    this.totalAmount = this.calculator.calculateTotalAmount(
      this.priceBeforeTax,
      this.taxAmount,
    );
  }
}
