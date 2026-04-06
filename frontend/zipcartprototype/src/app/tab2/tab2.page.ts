import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class Tab2Page implements OnInit {


  cartItems = [
    {
      name: 'Apple',
      store: 'Walmart, Mississauga',
      price: 2,
      qty: 1,
      image: 'assets/images/Apple.webp'
    },
    {
      name: 'Bread',
      store: 'Walmart, Mississauga',
      price: 2,
      qty: 1,
      image: 'assets/images/Bread.webp'
    },
    {
      name: 'Cake',
      store: 'Walmart, Mississauga',
      price: 20,
      qty: 1,
      image: 'assets/images/Cake.webp'
    }
  ];

  subTotal = 0;
  tax = 0;
  total = 0;

  ngOnInit() {
    this.calculateTotals(); 
  }

  increase(item: any) {
    item.qty++;

    // recalc after change
    this.calculateTotals();
  }

  decrease(item: any) {
    if (item.qty > 1) {
      item.qty--;
    }

    this.calculateTotals();
  }

  removeItem(item: any) {
    // simple filter remove
    this.cartItems = this.cartItems.filter(i => i !== item);

    this.calculateTotals();
  }

  calculateTotals() {

    // subtotal
    this.subTotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.price * item.qty);
    }, 0);

    // tax (13%)
    this.tax = +(this.subTotal * 0.13).toFixed(2);

    // total
    this.total = +(this.subTotal + this.tax).toFixed(2);
  }

}