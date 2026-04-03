import { AddWeighedProduct } from './../../classes/DTOs/AddWeighedProductDTO';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { WeighProductResponse } from 'src/app/classes/DTOs/WeighProductResponseDTO';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';

@Component({
  selector: 'app-live-weight',
  templateUrl: './live-weight.component.html',
  styleUrls: ['./live-weight.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class LiveWeightComponent implements OnInit {
  @Input() liveCart!: WeighProductResponse;

  priceBeforeTax: number = 0;
  taxAmount: number = 0;
  totalAmount: number = 0;

  addProduct: AddWeighedProduct = {
    itemId: '',
    weight: 0,
  };
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private calculator: CalculatorService,
  ) {}

  ngOnInit() {
    this.calculateTaxes();
  }

  /**
   *
   * MODAL BUTTON FUNCTIONALITIES
   */

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(weight: number, itemId: string) {
    this.addProduct.itemId = itemId;
    this.addProduct.weight = weight;
    return this.modalCtrl.dismiss(this.addProduct, 'confirm');
  }

  /**
   * REDIRECTING TO FRUITS AND VEG PAGE
   */

  navigateToFruitsAndVegPage() {
    this.router.navigate(['/fruits-and-veg']);
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
