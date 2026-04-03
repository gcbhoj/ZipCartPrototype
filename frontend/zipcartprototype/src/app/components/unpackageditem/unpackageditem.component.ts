import { Component, OnDestroy, OnInit } from '@angular/core';
import { UnPackagedProduct } from 'src/app/classes/Models/UnPackagedProduct';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { CommonModule } from '@angular/common';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-unpackageditem',
  templateUrl: './unpackageditem.component.html',
  styleUrls: ['./unpackageditem.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class UnpackageditemComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  cartInitResponse: StartShoppingResponse = {
    cartId: '',
    retailerName: '',
    budget: 0,
    message: '',
  };
  //Initializing unpackaed array to received shared data from cart page
  products: UnPackagedProduct[] = [];
  constructor(private dataSharing: Datasharing) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.receiveCartInitResponse();
  }

  // Receiving the packaged products
  receiveUnPackagedProducts() {
    this.dataSharing.unPackagedProduct
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.products = data;
      });
  }
  // receiving cart initialization response
  receiveCartInitResponse() {
    this.dataSharing.startShoppingResponseDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.cartInitResponse = data;
          this.receiveUnPackagedProducts();
        }
      });
  }
}
