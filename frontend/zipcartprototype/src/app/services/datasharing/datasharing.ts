import { PackagedProduct } from './../../classes/PackagedProduct';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BarCodeScannerResultDTO } from 'src/app/classes/BarCodeScannerResultDTO';
import { LoginResponse } from 'src/app/classes/LoginResponseDTO';
import { PackagedProductInformation } from 'src/app/classes/PackagedProductInformation';
import { StartShoppingResponse } from 'src/app/classes/StartShoppingResponse';
import { UnPackagedProduct } from 'src/app/classes/UnPackagedProduct';

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
    new BehaviorSubject<PackagedProductInformation | null>(null);
  packagedProductInfo: Observable<PackagedProductInformation | null> =
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
  exchangePackagedProductInformation(
    packgedProductInfo: PackagedProductInformation,
  ) {
    this.packagedProductInformation.next(packgedProductInfo);
  }
}
