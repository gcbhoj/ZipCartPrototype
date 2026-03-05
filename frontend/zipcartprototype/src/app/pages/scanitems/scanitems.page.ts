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
export class ScanitemsPage implements OnInit {
  productDisplayed = false;

  barCodeResults: BarCodeScannerResultDTO = {
    isValid: false,
    text: '',
    format: '',
    contentType: '',
  };

  constructor(private dataSharing: Datasharing) {}

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
}
