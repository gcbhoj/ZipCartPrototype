import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { PythonResponse } from 'src/app/classes/DTOs/PythonResponse';
import { Datasharing } from 'src/app/services/datasharing/datasharing';

@Component({
  selector: 'app-python-response',
  templateUrl: './python-response.component.html',
  styleUrls: ['./python-response.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true,
})
export class PythonResponseComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  sendImageURL: string = '';
  response: PythonResponse = {
    success: false,
    data: { productName: '', confidence: 0 },
    topPredictions: [],
  };
  constructor(private dataSharing: Datasharing) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.receivePythonResponse();
  }

  /**
   * DATA SHARING
   */

  receivePythonResponse() {
    this.dataSharing.sharePythonResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.response = data;
          this.receiveMockImageURL();
        }
      });
  }

  receiveMockImageURL() {
    this.dataSharing.shareTrialImage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.sendImageURL = data;
        }
      });
  }
}
