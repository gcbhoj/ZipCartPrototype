import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarcodescannerComponent } from 'src/app/components/barcodescanner/barcodescanner.component';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { BarCodeScannerResultDTO } from 'src/app/classes/DTOs/BarCodeScannerResultDTO';
import { ScannedProductDisplayComponent } from 'src/app/components/scanned-product-display/scanned-product-display.component';
import { BarcodeService } from 'src/app/services/mockserver/barcodeService/barcode-service';
import { ProductInformation } from 'src/app/classes/Models/PackagedProductInformation';
import { Router } from '@angular/router';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { ToastServices } from 'src/app/services/toastService/toast-services';
import { Cartservices } from 'src/app/services/mockserver/cartservice/cartservices';
import { PackagedProductRequests } from 'src/app/classes/DTOs/PackagedProductRequests';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';

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
    IonicModule,
  ],
})
export class ScanitemsPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  addItemsToCartButtonEnabled: boolean = true;

  productDisplayed = false;
  packagedProduct: ProductInformation = {
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

  cartInitResponse: StartShoppingResponse = {
    cartId: '',
    retailerName: '',
    budget: 0,
    message: '',
  };

  scannedPackagedProductRequest: PackagedProductRequests = {
    cartId: '',
    itemId: '',
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
    text: '5000112546415',
    format: '',
    contentType: '',
  };

  constructor(
    private dataSharing: Datasharing,
    private barCodeService: BarcodeService,
    private router: Router,
    private toast: ToastServices,
    private cartService: Cartservices,
    private calculator: CalculatorService,
  ) {}

  ngOnDestroy(): void {
    // ensure any subscribers using takeUntil(this.destroy$) are cleaned up
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.receiveBarcodeDetails();
    this.receiveCartInitResponse();
  }
  /**
   * DATA SHARING
   */

  receiveBarcodeDetails() {
    this.dataSharing.barcodeDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.barCodeResults = data;
        }
      });
  }

  //sharing the received packaged product information to display in its component
  sharePackagedProductInformation() {
    if (this.packagedProduct) {
      this.dataSharing.exchangePackagedProductInformation(this.packagedProduct);
      this.scannedPackagedProductRequest.itemId =
        this.packagedProduct.itemNumber;
    }
  }

  // receiving cart initialization response
  receiveCartInitResponse() {
    this.dataSharing.startShoppingResponseDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.cartInitResponse = data;
          this.scannedPackagedProductRequest.cartId =
            this.cartInitResponse.cartId;
        }
      });
  }

  /**
   *  API REQUESTS
   */

  // posting the received bar code to receive the product details
  sendBarCode() {
    this.barCodeService
      .getPackagedProductDetails(this.barCodeResults)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.packagedProduct = data;
          // initializing the share method
          this.sharePackagedProductInformation();
          //disables the scanner
          this.onProductLoaded();
        },
        error: (err) => {
          const message =
            err?.error?.message ||
            'FAILED TO GET PRODUCT BY SCANNING. PLEASE TRY AGAIN';
          this.toast.showError(message);
        },
      });
  }

  //Adding the scanned items to cart
  addScannedItemToCart() {
    this.cartService
      .addPackagedProductToCart(this.scannedPackagedProductRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toast.showSuccess(response.result);

          this.cartService.getCartByCartId(this.cartInitResponse.cartId);
          this.removeScannedItem();
        },
        error: (err) => {
          const message = err?.error?.message || 'FAILED TO ADD ITEM TO CART';
          this.toast.showError(message);
        },
      });
  }

  /**
   * FUNCTIONALITIES
   */

  //removing the scanned item when cancel is pressed
  removeScannedItem() {
    //creating a empty object
    const emptyProduct: ProductInformation = {
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
    this.addItemsToCartButtonEnabled = false;
  }

  // navigate to home page
  goToHomePage() {
    this.router.navigate(['/tabs/tab1']);
  }

  // enabling and disabling the scanner to avoid multiple scanning

  onProductLoaded() {
    this.productDisplayed = true;
  }

  onProductCleared() {
    this.productDisplayed = false;
  }
}
