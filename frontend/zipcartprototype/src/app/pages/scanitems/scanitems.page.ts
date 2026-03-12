/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarcodescannerComponent } from 'src/app/components/barcodescanner/barcodescanner.component';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { BarCodeScannerResultDTO } from 'src/app/classes/BarCodeScannerResultDTO';
import { ScannedProductDisplayComponent } from 'src/app/components/scanned-product-display/scanned-product-display.component';
import { BarcodeService } from 'src/app/services/mockserver/barcodeService/barcode-service';
import { PackagedProductInformation } from 'src/app/classes/PackagedProductInformation';
import { IONIC_UI } from 'src/UIImports';
import { Router } from '@angular/router';
import { StartShoppingResponse } from 'src/app/classes/StartShoppingResponse';

@Component({
  selector: 'app-scanitems',
  templateUrl: './scanitems.page.html',
  styleUrls: ['./scanitems.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarcodescannerComponent,
    ScannedProductDisplayComponent,
    IONIC_UI,
  ],
})
export class ScanitemsPage implements OnInit {
  productDisplayed = false;
  packagedProduct: PackagedProductInformation = {
    itemNumber: '',
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

  scannedProductItemId: string = '';

    cartInitResponse: StartShoppingResponse = {
      cartId: '',
      retailerName: '',
      budget: 0,
      message: '',
    };

  //barcodes of mock data stored in mock server NOTE:FOR TESTING PURPOSES ONLY

  barcodes: string[] = [
    '5000112546415',
    '049000050158',
    '049000028911',
    '012000809151',
    '012000161938',
    '041508260003',
    '070847000328',
    '041800000038',
    '4902430780010',
    '044000032029',
    '028400064505',
    '028400064529',
    '016000275410',
    '030000561516',
    '048000001234',
    '034000052356',
    '037000373925',
    '040000000452',
    '041570109843',
    '041570110000',
  ];

  barCodeResults: BarCodeScannerResultDTO = {
    isValid: true,
    text: '041508260003',
    format: '',
    contentType: '',
  };

  constructor(
    private dataSharing: Datasharing,
    private barCodeService: BarcodeService,
    private router: Router,
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
          this.scannedProductItemId = this.packagedProduct.itemNumber;
          console.log(this.scannedProductItemId);
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

  //removing the scanned item when cancel is pressed
  removeScannedItem() {
    //creating a empty object
    const emptyProduct: PackagedProductInformation = {
      itemNumber: '',
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

    this.packagedProduct = emptyProduct;

    // update shared observable
    this.dataSharing.exchangePackagedProductInformation(emptyProduct);
    // enabling the scanner
    this.onProductCleared();
  }

  // navigate to home page
  goToHomePage() {
    this.router.navigate(['/tabs/tab1']);
  }


}
