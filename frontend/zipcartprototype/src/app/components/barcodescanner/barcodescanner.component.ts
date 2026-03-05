import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarCodeScannerResultDTO } from 'src/app/classes/BarCodeScannerResultDTO';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { Input } from '@angular/core';
import {
  Barcode,
  BarcodeScanner,
  BarcodeFormat,
  BarcodeValueType,
} from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { IonFabButton, IonIcon, IonContent } from '@ionic/angular/standalone';
@Component({
  selector: 'app-barcodescanner',
  templateUrl: './barcodescanner.component.html',
  styleUrls: ['./barcodescanner.component.scss'],
  standalone: true,
  imports: [CommonModule, IonFabButton, IonIcon, IonContent],
})
export class BarcodescannerComponent implements OnInit {
  @Input() disabled = false;
  isSupported = false;
  barcodes: Barcode[] = [];
  barcodeResults: BarCodeScannerResultDTO[] = [];

  constructor(
    private alertController: AlertController,
    private dataSharing: Datasharing,
  ) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();

    if (this.disabled) {
      return;
    }
    if (!granted) {
      await this.presentAlert();
      return;
    }

    const { barcodes } = await BarcodeScanner.scan();

    const results = barcodes.map((b) => this.mapToDto(b));
    this.barcodeResults.push(...results);
    // sharing the scanned results to the scan items page to create a post request
    this.shareScannedResults(results[0]);

    const alert = await this.alertController.create({
      header: 'Barcode Read Successfully',
      message: JSON.stringify(results[0], null, 2),
      buttons: ['OK'],
    });

    await alert.present();
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  mapToDto(barcode: Barcode): BarCodeScannerResultDTO {
    return {
      isValid: !!barcode.rawValue,
      text: barcode.rawValue ?? '',
      format: barcode.format?.toString(),
      contentType: barcode.valueType?.toString(),
    };
  }

  shareScannedResults(result: BarCodeScannerResultDTO) {
    this.dataSharing.exchangeBarCodeScannedResults(result);
  }
}
