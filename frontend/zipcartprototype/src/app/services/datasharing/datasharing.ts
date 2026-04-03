import { PackagedProduct } from '../../classes/Models/PackagedProduct';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BarCodeScannerResultDTO } from 'src/app/classes/DTOs/BarCodeScannerResultDTO';
import { LoginResponse } from 'src/app/classes/DTOs/LoginResponseDTO';
import { ProductInformation } from 'src/app/classes/Models/PackagedProductInformation';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { UnPackagedProduct } from 'src/app/classes/Models/UnPackagedProduct';
import { PythonResponse } from 'src/app/classes/DTOs/PythonResponse';

@Injectable({
  providedIn: 'root',
})

/***
 * Creating a BehaviorSubject to store and share the cart initialization response
across multiple components or pages in the application.

BehaviorSubject is used because it always keeps the latest value and immediately
provides it to any new subscribers.

The initial value is set to null since the response from the backend will only
be available after the cart initialization API is called.

startShoppingResponse (private):
  - Acts as the internal data holder that can be updated using .next().
  - Only this service can modify the value.

startShoppingResponseDetails (public Observable):
  - Exposes the BehaviorSubject as a read-only Observable to other components.
  - Components can subscribe to it to receive updates whenever the cart
    initialization response changes.
  - Using asObservable() prevents external components from directly modifying
    the BehaviorSubject value.
 */
export class Datasharing {
  private packagedProductSharing = new BehaviorSubject<PackagedProduct[]>([]);
  packagedProduct: Observable<PackagedProduct[]> =
    this.packagedProductSharing.asObservable();

  private barcodeDetailsSharing =
    new BehaviorSubject<BarCodeScannerResultDTO | null>(null);
  barcodeDetails: Observable<BarCodeScannerResultDTO | null> =
    this.barcodeDetailsSharing.asObservable();

  private unPackagedProductSharing = new BehaviorSubject<UnPackagedProduct[]>(
    [],
  );
  unPackagedProduct: Observable<UnPackagedProduct[]> =
    this.unPackagedProductSharing.asObservable();

  private packagedProductInformation =
    new BehaviorSubject<ProductInformation | null>(null);
  packagedProductInfo: Observable<ProductInformation | null> =
    this.packagedProductInformation.asObservable();

  // logged in user information
  private loginResponseSharing = new BehaviorSubject<LoginResponse | null>(
    null,
  );
  loggedInUserInformation: Observable<LoginResponse | null> =
    this.loginResponseSharing.asObservable();

  // newly created cart information
  private startShoppingResponse =
    new BehaviorSubject<StartShoppingResponse | null>(null);
  startShoppingResponseDetails: Observable<StartShoppingResponse | null> =
    this.startShoppingResponse.asObservable();

  // vendor button state
  private vendorButtonState = new BehaviorSubject<boolean>(true);
  vendorButtonState$ = this.vendorButtonState.asObservable();

  // Packaged product item id sharing
  private packagedProductItemIdSharing = new BehaviorSubject<string | null>(
    null,
  );
  packagedProductItemId$: Observable<string | null> =
    this.packagedProductItemIdSharing.asObservable();

  // Packaged product total sharing from packaged item component to cart component

  private packagedProductTotalSharing = new BehaviorSubject<number | null>(
    null,
  );
  PackagedProductTotal$ = this.packagedProductTotalSharing.asObservable();

  private unPackagedProductTotalSharing = new BehaviorSubject<number | null>(
    null,
  );
  unPackagedProductTotal$ = this.unPackagedProductTotalSharing.asObservable();

  // sharing the image from camera component to fruits and veg page
  private imageSharing = new BehaviorSubject<string | null>(null);
  imageSharing$ = this.imageSharing.asObservable();

  private shareProductInformationArray = new BehaviorSubject<
    ProductInformation[] | null
  >(null);
  shareProductInformationArray$ =
    this.shareProductInformationArray.asObservable();

  //sharing the image from send image button
  private shareTrialImage = new BehaviorSubject<string | null>(null);
  shareTrialImage$ = this.shareTrialImage.asObservable();

  // sharing python response from fruits and veg to python response
  private sharePythonResponse = new BehaviorSubject<PythonResponse | null>(
    null,
  );
  sharePythonResponse$ = this.sharePythonResponse.asObservable();

  constructor() {}

  //exchanging start shopping response
  exchangeCartInitializationResponse(response: StartShoppingResponse) {
    this.startShoppingResponse.next(response);
  }

  //exchanging the logged in user information for display
  exchangeLoginResponse(response: LoginResponse) {
    this.loginResponseSharing.next(response);
  }

  // exchanging packaged Product
  exchangePackagedProduct(products: PackagedProduct[]) {
    this.packagedProductSharing.next(products);
  }

  //exchanging unpackaged product
  exchangeUnPackagedProduct(products: UnPackagedProduct[]) {
    this.unPackagedProductSharing.next(products);
  }

  //exchanging the bar code scanned results to be used for post method
  exchangeBarCodeScannedResults(
    barCodeScanningResults: BarCodeScannerResultDTO,
  ) {
    this.barcodeDetailsSharing.next(barCodeScanningResults);
  }

  //exchanging the packaged product information
  exchangePackagedProductInformation(packagedProductInfo: ProductInformation) {
    this.packagedProductInformation.next(packagedProductInfo);
  }
  /**
   *
   * @param state
   * to initialize one user one cart vendor button gets disabled
   * to reintialize this service can be called once the transaction is complete
   * to enable shoppers to start a new transaction.
   */
  updateRetailerButtonState(state: boolean) {
    this.vendorButtonState.next(state);
  }

  //exchanging packaged product total
  exchangePackagedProductTotal(total: number) {
    this.packagedProductTotalSharing.next(total);
  }

  //exchanging un packaged product total
  exchangeUnPackagedProductTotal(total: number) {
    this.unPackagedProductTotalSharing.next(total);
  }

  //exchange the captured product image from camera sharing service
  exchangeUnpackagedProductImage(imageURL: string) {
    this.imageSharing.next(imageURL);
  }

  //exchanging the product information retreived from image upload
  exchangeProductInformationArray(products: ProductInformation[]) {
    this.shareProductInformationArray.next(products);
  }

  // exchanging the image URL of the image from send image button
  exchangeMockImage(imageURL: string) {
    this.shareTrialImage.next(imageURL);
  }

  // exchange python response
  exchangePythonResponse(response: PythonResponse) {
    this.sharePythonResponse.next(response);
  }
}
