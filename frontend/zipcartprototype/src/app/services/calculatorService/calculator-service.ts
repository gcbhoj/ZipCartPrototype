import { PackagedProduct } from './../../classes/Models/PackagedProduct';
import { Injectable } from '@angular/core';
import { UnPackagedProduct } from 'src/app/classes/Models/UnPackagedProduct';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  TAX_PERCENT: number = 0.13;

  calculateProductTotalWithoutTaxes(
    products: (PackagedProduct | UnPackagedProduct)[],
  ): number {
    let total = 0;

    products.forEach((product) => {
      let productTotal = 0;

      // Packaged scenario
      if ('unitPrice' in product && 'quantity' in product) {
        productTotal = product.unitPrice * product.quantity;
      }

      // Unpackaged scenario (weight-based)
      if ('unitPrice' in product && 'weight' in product) {
        productTotal = product.unitPrice * product.weight;
      }

      // Store inside object
      (product as any).taxBeforeTax = productTotal;

      total += productTotal;
    });

    return total;
  }

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

  performAddition(firstNumber: number, secondNumber: number): number {
    if (typeof firstNumber === 'number' && typeof secondNumber === 'number') {
      let total = firstNumber + secondNumber;
      return Number(total.toFixed(2));
    }

    return 0;
  }
}
