/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarCodeScannerResultDTO } from 'src/app/classes/BarCodeScannerResultDTO';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { Input } from '@angular/core';
import { IONIC_UI } from 'src/UIImports';
import {
  Barcode,
  BarcodeScanner,
  BarcodeFormat,
  BarcodeValueType,
} from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-barcodescanner',
  templateUrl: './barcodescanner.component.html',
  styleUrls: ['./barcodescanner.component.scss'],
  standalone: true,
  imports: [CommonModule, IONIC_UI],
})
export class BarcodescannerComponent implements OnInit {
  // Input property allows parent component to enable/disable the scanner
  @Input() disabled = false;
  // whether the device supports barcode scanning
  isSupported = false;
  // Storing raw barcode objects returned from ML Kit
  barcodes: Barcode[] = [];
  //Mapping the scanning results to DTO to be transferred to backedn
  barcodeResults: BarCodeScannerResultDTO[] = [];

  constructor(
    private alertController: AlertController,
    private dataSharing: Datasharing,
  ) {}

  ngOnInit() {
    // Check if barcode scanning is supported on the device
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  // Method triggered when the user presses the scan button
  async scan(): Promise<void> {
    // Request camera permissions from the user
    const granted = await this.requestPermissions();
    // If scanner is disabled from parent component, stop execution
    if (this.disabled) {
      return;
    }
    // If permission was not granted, show alert
    if (!granted) {
      await this.presentAlert();
      return;
    }
    // Start scanning for barcodes using ML Kit
    const { barcodes } = await BarcodeScanner.scan();
    // Convert raw barcode results into DTO objects used in the app
    const results = barcodes.map((b) => this.mapToDto(b));
    // Store scanned results in the local array
    this.barcodeResults.push(...results);
    // sharing the scanned results to the scan items page to create a post request
    this.shareScannedResults(results[0]);
    /*NOTE: MUST BE REMOVED AFTER TESTING WITH COMPLETE PRODUCT
    Displays a success alert with a ok button with the scanning results
    */
    const alert = await this.alertController.create({
      header: 'Barcode Read Successfully',
      message: JSON.stringify(results[0], null, 2),
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Requests camera permission required for barcode scanning
  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    // Return true if permission is granted or limited access is allowed
    return camera === 'granted' || camera === 'limited';
  }

  // Displays alert if camera permission is denied
  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  // Mapping ML Kit Barcode object into application DTO format
  mapToDto(barcode: Barcode): BarCodeScannerResultDTO {
    return {
      isValid: !!barcode.rawValue,
      text: barcode.rawValue ?? '',
      format: barcode.format?.toString(),
      contentType: barcode.valueType?.toString(),
    };
  }
  // Shares the scanned barcode result with other components using the data sharing service
  // to be shared with scan item page to create a post request

  shareScannedResults(result: BarCodeScannerResultDTO) {
    this.dataSharing.exchangeBarCodeScannedResults(result);
  }
}
