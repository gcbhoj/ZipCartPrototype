/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { PackagedProduct } from 'src/app/classes/PackagedProduct';
import { IONIC_UI } from 'src/UIImports';
import { CommonModule } from '@angular/common';
import { Datasharing } from 'src/app/services/datasharing/datasharing';

@Component({
  selector: 'app-packageditem',
  templateUrl: './packageditem.component.html',
  styleUrls: ['./packageditem.component.scss'],
  standalone: true,
  imports: [CommonModule, IONIC_UI],
})
export class PackageditemComponent implements OnInit {
  //initializing the cart id to store when received from cart page to create post request
  cartId: string | null = '';
  //initializing the products array to store received products
  products: PackagedProduct[] = [];
  constructor(private dataSharing: Datasharing) {}

  ngOnInit() {
    this.receiveCartId();
  }

  // Receiving the cart id IF IN CASE NEEDED
  receiveCartId() {
    this.dataSharing.currentCartId.subscribe((data) => {
      this.cartId = data;
      this.receivePackagedProducts();
    });
  }

  // Receiving the packaged products
  receivePackagedProducts() {
    this.dataSharing.packagedProduct.subscribe((data) => {
      this.products = data;
    });
  }
}
