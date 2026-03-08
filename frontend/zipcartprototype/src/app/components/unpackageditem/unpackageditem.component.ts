/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { UnPackagedProduct } from 'src/app/classes/UnPackagedProduct';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { CommonModule } from '@angular/common';
import { IONIC_UI } from 'src/UIImports';
import { StartShoppingResponse } from 'src/app/classes/StartShoppingResponse';

@Component({
  selector: 'app-unpackageditem',
  templateUrl: './unpackageditem.component.html',
  styleUrls: ['./unpackageditem.component.scss'],
  standalone: true,
  imports: [CommonModule, IONIC_UI],
})
export class UnpackageditemComponent implements OnInit {
  cartInitResponse: StartShoppingResponse = {
    cartId: '',
    retailerName: '',
    budget: 0,
    message: '',
  };
  //Initializing unpackaed array to received shared data from cart page
  products: UnPackagedProduct[] = [];
  constructor(private dataSharing: Datasharing) {}

  ngOnInit() {
    this.receiveCartInitResponse();
  }

  // Receiving the packaged products
  receiveUnPackagedProducts() {
    this.dataSharing.unPackagedProduct.subscribe((data) => {
      this.products = data;
    });
  }
  // receiving cart initialization response
  receiveCartInitResponse() {
    this.dataSharing.startShoppingResponseDetails.subscribe((data) => {
      if (data) {
        this.cartInitResponse = data;
        this.receiveUnPackagedProducts();
      }
    });
  }
}
