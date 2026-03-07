import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarcodescannerComponent } from 'src/app/components/barcodescanner/barcodescanner.component';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { BarCodeScannerResultDTO } from 'src/app/classes/BarCodeScannerResultDTO';
import { ScannedProductDisplayComponent } from 'src/app/components/scanned-product-display/scanned-product-display.component';
import { BarcodeService } from 'src/app/services/mockserver/barcodeService/barcode-service';
import { PackagedProductInformation } from 'src/app/classes/PackagedProductInformation';
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
  packagedProduct: PackagedProductInformation = {
    itemNumber: 0,
    productName: '',
    imageURL: '',
    price: 0,
    weight: '',
    ingredients: [],
    manufacturedDate: new Date(),
    expiryDate: new Date(),
    manufacturer: '',
    manufacturedIn: '',
    aboutProduct: '',
    quantity: 0,
  };

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
          this.packagedProduct = data;
          // initializing the share method
          this.sharePackagedProductInformation();
          //disables the scanner
          this.onProductLoaded();
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
  }

  //sharing the received packaged product information to display in its component
  sharePackagedProductInformation() {
    if (this.packagedProduct) {
      this.dataSharing.exchangePackagedProductInformation(this.packagedProduct);
    }
  }
}
