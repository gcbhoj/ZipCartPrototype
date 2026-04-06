import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


import { ToastServices } from '../../services/toastService/toast-services';

@Component({
  selector: 'app-fruits-and-veg',
  templateUrl: './fruits-and-veg.page.html',
  styleUrls: ['./fruits-and-veg.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class FruitsAndVegPage {


  private toast = inject(ToastServices);

  
  product = {
    name: 'Orange',
    price: 10,
    image: 'assets/images/ORANGES.jpg'
  };

  constructor() {

  }

  takePhoto() {
    console.log('Opening camera...');


    this.toast.showSuccess('Camera not implemented yet');
  }

  uploadImage() {
    console.log('Uploading image...');


    this.toast.showSuccess('Upload not implemented yet');
  }

  addToCart() {

    if (!this.product) {
      console.log('No product found');
      return;
    }

    this.toast.showSuccess(`${this.product.name} added to cart`);

   
  }

}