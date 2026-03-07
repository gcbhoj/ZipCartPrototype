import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarCodeScannerResultDTO } from 'src/app/classes/BarCodeScannerResultDTO';

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  // change to the below backend url while working with web
  private backendUrl: string = 'http://localhost:3000/mockserver/scanner/';
  // change to the below backend url while working with emulator
  private backendUrlEmulator: string = 'http://10.0.2.2:3000/mockserver/';
  // change to the below backend url while working with device where the 0.0.0.0 is the users IPV4 Address
  private backendUrlDevice: string = 'http://00.0.0.0:3000/mockserver/';

  constructor(private http: HttpClient) {}

  getPackagedProductDetails(
    barcodeResult: BarCodeScannerResultDTO,
  ): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}scan`, barcodeResult);
  }
}
