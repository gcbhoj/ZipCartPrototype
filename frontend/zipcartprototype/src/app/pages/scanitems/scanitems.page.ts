import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { BarcodescannerComponent } from 'src/app/components/barcodescanner/barcodescanner.component';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { BarCodeScannerResultDTO } from 'src/app/classes/BarCodeScannerResultDTO';
import { ScannedProductDisplayComponent } from 'src/app/components/scanned-product-display/scanned-product-display.component';
import { BarcodeService } from 'src/app/services/mockserver/barcodeService/barcode-service';

@Component({
  selector: 'app-scanitems',
  templateUrl: './scanitems.page.html',
  styleUrls: ['./scanitems.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    BarcodescannerComponent,
    ScannedProductDisplayComponent,
    IonButton,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
//text: '5000112546415',
export class ScanitemsPage implements OnInit {
  productDisplayed = false;

  barCodeResults: BarCodeScannerResultDTO = {
    isValid: true,
    text: '041570110000',
    format: '',
    contentType: '',
  };

  constructor(
    private dataSharing: Datasharing,
    private barCodeService: BarcodeService,
  ) {}

  ngOnInit() {
    this.receiveBarcodeDetails();
  }

  receiveBarcodeDetails() {
    this.dataSharing.barcodeDetails.subscribe((data) => {
      if (data) {
        this.barCodeResults = data;
      }
    });
  }

  onProductLoaded() {
    this.productDisplayed = true;
  }

  onProductCleared() {
    this.productDisplayed = false;
  }

  // posting the received bar code to receive the product details
  sendBarCode() {
    this.barCodeService
      .getPackagedProductDetails(this.barCodeResults)
      .subscribe({
        next: (data) => {
          console.log('Product Data:', data);
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
  }
}
