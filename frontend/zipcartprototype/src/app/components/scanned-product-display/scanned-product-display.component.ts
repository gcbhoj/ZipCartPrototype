import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductInformation } from 'src/app/classes/Models/PackagedProductInformation';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { CommonModule } from '@angular/common';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-scanned-product-display',
  templateUrl: './scanned-product-display.component.html',
  styleUrls: ['./scanned-product-display.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ScannedProductDisplayComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  //Initializing the PackedProductInformation to map with incoming scanned result
  product!: ProductInformation;
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.receiveProductInfo();
  }

  //Receiving the product information shared by the scan items page.
  receiveProductInfo() {
    this.dataSharing.packagedProductInfo
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.product = data;
          this.taxAmount = this.calculator.calculateTaxAmount(
            this.product.price,
          );
          this.totalAmount = this.calculator.performAddition(
            this.taxAmount,
            this.product.price,
          );
          this.selectedPackagedProductItemId = this.product.itemNumber;
        }
      });
  }
}
