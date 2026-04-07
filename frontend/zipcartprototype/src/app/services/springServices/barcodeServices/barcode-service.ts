import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BarCodeScannerResultDTO } from 'src/app/classes/DTOs/BarCodeScannerResultDTO';
import { ProductInformation } from 'src/app/classes/Models/PackagedProductInformation';
@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  // change to the below backend url while working with web
  private backendUrl: string = 'http://localhost:5000/mockserver/scanner/';
  // change to the below backend url while working with emulator
  private backendUrlEmulator: string =
    'http://10.0.2.2:5000/mockserver/scanner/';
  // change to the below backend url while working with device where the 0.0.0.0 is the users IPV4 Address
  private backendUrlDevice: string =
    'http://10.0.0.87:5000/mockserver/scanner/';

  constructor(private http: HttpClient) {}

  getPackagedProductDetails(
    barcodeResult: BarCodeScannerResultDTO,
  ): Observable<ProductInformation> {
    return this.http.post<ProductInformation>(
      this.backendUrl + 'scan',
      barcodeResult,
    );
  }
}
