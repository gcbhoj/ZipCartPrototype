import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PythonResponse } from 'src/app/classes/DTOs/PythonResponse';
import { Datasharing } from 'src/app/services/datasharing/datasharing';

@Component({
  selector: 'app-python-response',
  templateUrl: './python-response.component.html',
  styleUrls: ['./python-response.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class PythonResponseComponent implements OnInit {
  sendImageURL: string = '';
  response: PythonResponse = {
    success: false,
    data: { productName: '', confidence: 0 },
    topPredictions: [],
  };
  constructor(private dataSharing: Datasharing) {}

  ngOnInit() {
    this.receivePythonResponse();
    console.log(this.response.topPredictions);
  }

  /**
   * DATA SHARING
   */

  receivePythonResponse() {
    this.dataSharing.sharePythonResponse$.subscribe((data) => {
      if (data) {
        this.response = data;
        this.receiveMockImageURL();
      }
    });
  }

  receiveMockImageURL() {
    this.dataSharing.shareTrialImage$.subscribe((data) => {
      if (data) {
        this.sendImageURL = data;
      }
    });
  }
}
