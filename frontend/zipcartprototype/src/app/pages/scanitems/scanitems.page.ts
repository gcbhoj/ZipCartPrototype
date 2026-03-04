import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { BarcodescannerComponent } from 'src/app/components/barcodescanner/barcodescanner.component';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { BarCodeScannerResultDTO } from 'src/app/classes/BarCodeScannerResultDTO';

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
  ],
})
export class ScanitemsPage implements OnInit {
  constructor(private dataSharing: Datasharing) {}

  barCodeResults: BarCodeScannerResultDTO = {
    isValid: false,
    text: '',
    format: '',
    contentType: '',
  };

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
}
