import { Component, NgZone, OnInit } from '@angular/core';
import { IONIC_UI } from 'src/UIImports';
import { Router } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { Datasharing } from '../services/datasharing/datasharing';
import { RetailerServices } from '../services/mockserver/retailerService/retailer-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertServices } from '../services/alertService/alert-services';
import { Cartservices } from '../services/mockserver/cartservice/cartservices';
import { ToastServices } from '../services/toastService/toast-services';

import { Retailer } from '../classes/Models/Retailer';
import { StartShoppingResponse } from '../classes/DTOs/StartShoppingResponse';
import { LoginResponse } from '../classes/DTOs/LoginResponseDTO';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IONIC_UI, LoginComponent, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {

  // not sure if I'll need this later but keeping it for now
  isEnabled: boolean = true;

  retailers: Retailer[] = [];

  cartInitResponse: StartShoppingResponse = {
    cartId: '',
    retailerName: '',
    budget: 0,
    message: '',
  };

  login: LoginResponse = {
    userId: '',
    userName: '',
    message: '',
  };

  constructor(
    private router: Router,
    private dataSharing: Datasharing,
    private retailerService: RetailerServices,
    private alertService: AlertServices,
    private cartService: Cartservices,
    private toast: ToastServices,
    private zone: NgZone
  ) {}

  ngOnInit(): void {

    this.loadRetailers();

    this.dataSharing.vendorButtonState$.subscribe((state) => {
      this.isEnabled = state;
    });
  }


  loadRetailers() {

    const tempList: Retailer[] = [
      {
        retailerId: '1',
        retailerName: 'Costco',
        retailerLogoUrl: 'assets/images/costco.png',
        retailerURL: ''
      },
      {
        retailerId: '2',
        retailerName: 'Home Depot',
        retailerLogoUrl: 'assets/images/The_home_depot.jpg',
        retailerURL: ''
      },
      {
        retailerId: '3',
        retailerName: 'Walmart',
        retailerLogoUrl: 'assets/images/Walmart.png',
        retailerURL: ''
      }
    ];

  
    this.retailers = tempList;
  }

  startShopping(retailerId: string) {

    if (!retailerId) {
      console.log('no retailer id??');
      return;
    }


    this.toast.showSuccess(`Selected retailer: ${retailerId}`);

    // TODO: later connect to real API
  }

  enableRetailerButton() {
    this.zone.run(() => {
      this.dataSharing.updateRetailerButtonState(true);
    });
  }
}