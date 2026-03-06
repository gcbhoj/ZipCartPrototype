import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarCodeScannerResultDTO } from 'src/app/classes/BarCodeScannerResultDTO';

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  private backendUrl: string = 'http://localhost:3000/mockserver/scanner/';
  private backendUrlEmulator: string = 'http://10.0.2.2:3000/mockserver/cart/';
  private backendUrlDevice: string = 'http://10.0.0.89:3000/mockserver/cart/';

  constructor(private http: HttpClient) {}

  getPackagedProductDetails(
    barcodeResult: BarCodeScannerResultDTO,
  ): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}scan`, barcodeResult);
  }
}
