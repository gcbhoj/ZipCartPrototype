import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { Datasharing } from '../services/datasharing/datasharing';
import { RetailerServices } from '../services/mockserver/retailerService/retailer-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertServices } from '../services/alertService/alert-services';
import { StartShopping } from '../classes/DTOs/StartShoppingDTO';
import { Cartservices } from '../services/mockserver/cartservice/cartservices';
import { StartShoppingResponse } from '../classes/DTOs/StartShoppingResponse';
import { ToastServices } from '../services/toastService/toast-services';
import { LoginResponse } from '../classes/DTOs/LoginResponseDTO';
import { Retailer } from '../classes/Models/Retailer';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, LoginComponent, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {
  isEnabled: boolean = true;
  retailers: Retailer[] = [];
  budget: number = 0;
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
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.receiveLoginResponse();
    this.dataSharing.vendorButtonState$.subscribe((state) => {
      this.isEnabled = state;
    });
  }

  goToTestPage() {
    this.router.navigate(['/testpage']);
  }

  startShopping(retailerId: string) {
    this.disableRetailerButton();
    this.alertService.showBudgetConfirmation(
      // OK pressed
      () => {
        this.alertService.showBudgetInput((budget) => {
          this.budget = budget | 0;
          if (this.budget > 0) {
            this.toast.showSuccess(
              `BUDGET SET: ${this.budget}. CHANGE FROM PROFILE PAGE(CHANGE THE PROFILE TO LINK)`,
            );
          }
          const dto = this.mapToStartShoppingDTO(
            this.login.userId,
            retailerId,
            this.budget,
          );

          this.initializeCartForShopper(dto);
        });
      },

      // Cancel pressed
      () => {
        const dto = this.mapToStartShoppingDTO(
          this.login.userId,
          retailerId,
          this.budget,
        );

        this.initializeCartForShopper(dto);
      },
    );
  }

  //receiving the login response via subscribing
  receiveLoginResponse() {
    this.dataSharing.loggedInUserInformation.subscribe((data) => {
      if (data) {
        this.login = data;
        this.receiveRetailers();
      }
    });
  }

  // receiving the list of registered retailers
  receiveRetailers() {
    this.retailerService.fetchAllRetailers();
    this.retailerService.retailer$.subscribe((retailers: Retailer[]) => {
      this.retailers = retailers;
    });
  }

  // Mapping variables to DTO to post to backend
  mapToStartShoppingDTO(
    userId: string,
    retailerId: string,
    budget: number,
  ): StartShopping {
    return {
      userId,
      retailerId,
      budget,
    };
  }

  // calling the cart services to initialize a new table
  initializeCartForShopper(shoppingDTO: StartShopping) {
    this.cartService.initializeCart(shoppingDTO).subscribe({
      next: (response) => {
        this.cartInitResponse = response;
        this.toast.showSuccess(response.message);
        this.shareCartInitResponse();
        // this.router.navigate(['/tabs/scanItems']);
      },
      error: (err) => {
        const message = err?.error?.message || 'Unable to initialize cart';
        this.enableRetailerButton();
        this.toast.showError(message);
      },
    });
  }
  // sharing the response object to cart component to retrieve
  // products from the cart for display
  shareCartInitResponse() {
    this.dataSharing.exchangeCartInitializationResponse(this.cartInitResponse);
  }

  enableRetailerButton() {
    this.zone.run(() => {
      this.dataSharing.updateRetailerButtonState(true);
    });
  }

  disableRetailerButton() {
    this.zone.run(() => {
      this.dataSharing.updateRetailerButtonState(false);
    });
  }
}
