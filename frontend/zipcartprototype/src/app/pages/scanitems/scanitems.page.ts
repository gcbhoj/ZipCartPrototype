import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scanitems',
  templateUrl: './scanitems.page.html',
  styleUrls: ['./scanitems.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ScanitemsPage {

  productDisplayed = true; 

  quantity = 1;

  
  scannedProduct = {
    name: 'Lays',
    store: 'Walmart Mississauga',
    price: 10,
    image: 'assets/images/lays.jpg' 
  };

  constructor() {
  
  }

  sendBarcode() {
    console.log('Scanning...');
  }

  increaseQty() {
    this.quantity++;

    if (this.quantity > 99) {
      this.quantity = 99;
    }
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addScannedItemToCart() {
    alert(`Added ${this.quantity} item(s) to cart`);
  }

  onProductCleared() {
    this.productDisplayed = false;
  }
}