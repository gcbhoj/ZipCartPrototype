import { Injectable } from '@angular/core';
import { PackagedProduct } from 'src/app/classes/Models/PackagedProduct';
import { UnPackagedProduct } from 'src/app/classes/Models/UnPackagedProduct';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  TAX_PERCENT: number = 0.13;

  // calculating tax amount with 13 % HST
  calculateTaxAmount(unitPrice: number): number {
    if (!unitPrice) {
      return 0;
    }

    let amount = unitPrice * this.TAX_PERCENT;

    return Number(amount.toFixed(2));
  }

  // calculating total amount after taxes
  calculateTotalAmount(unitPrice: number, taxAmount: number): number {
    if (!unitPrice) {
      return 0;
    }
    if (!taxAmount) {
      return 0;
    }

    let amount = unitPrice + taxAmount;

    return Number(amount.toFixed(2));
  }

  //calculating total product price
  calculateTotalProductPrice(unitPrice: number, quantity: number): number {
    if (!unitPrice || !quantity) {
      return 0;
    }

    let totalAmount = unitPrice * quantity;

    return Number(totalAmount.toFixed(2));
  }

  //calculating total amount of the packaged items in the cart
  calculateTotalAmountPackagedItems(
    packagedProducts: PackagedProduct[],
  ): number {
    let totalAmount: number = 0;

    packagedProducts.forEach((product) => {
      totalAmount += this.calculateTotalProductPrice(
        product.unitPrice,
        product.quantity,
      );
    });

    return Number(totalAmount.toFixed(2));
  }

  //calculating total amount of the packaged items in the cart
  calculateTotalAmountUnPackagedItems(
    packagedProducts: UnPackagedProduct[],
  ): number {
    let totalAmount: number = 0;

    packagedProducts.forEach((product) => {
      totalAmount += this.calculateTotalProductPrice(
        product.unitPrice,
        product.weight,
      );
    });

    return Number(totalAmount.toFixed(2));
  }

  //calculate totalCartAmount
  calculateTotalCartAmount(
    totalPackagedProduct: number,
    totalUnPackagedProduct: number,
  ): number {
    if (!totalUnPackagedProduct || !totalUnPackagedProduct) {
      return 0;
    }
    let totalAmount = totalPackagedProduct + totalUnPackagedProduct;

    return Number(totalAmount.toFixed(2));
  }
}
