/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { UnPackagedProduct } from 'src/app/classes/UnPackagedProduct';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { CommonModule } from '@angular/common';
import { IONIC_UI } from 'src/UIImports';

@Component({
  selector: 'app-unpackageditem',
  templateUrl: './unpackageditem.component.html',
  styleUrls: ['./unpackageditem.component.scss'],
  standalone: true,
  imports: [CommonModule, IONIC_UI],
})
export class UnpackageditemComponent implements OnInit {
  //Initializing the cart id to be received from cart page
  cartId: string | null = '';
  //Initializing unpackaed array to received shared data from cart page
  products: UnPackagedProduct[] = [];
  constructor(private dataSharing: Datasharing) {}

  ngOnInit() {
    this.receiveCartId();
  }

  // Receiving the cart id IF IN CASE NEEDED
  receiveCartId() {
    this.dataSharing.currentCartId.subscribe((data) => {
      this.cartId = data;
      this.receiveUnPackagedProducts();
    });
  }

  // Receiving the packaged products
  receiveUnPackagedProducts() {
    this.dataSharing.unPackagedProduct.subscribe((data) => {
      this.products = data;
    });
  }
}
