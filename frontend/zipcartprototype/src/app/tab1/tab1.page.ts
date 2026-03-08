import { LoginResponse } from './../classes/LoginResponseDTO';
import { Retailer } from './../classes/Retailer';
/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { IONIC_UI } from 'src/UIImports';
import { Router } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { Datasharing } from '../services/datasharing/datasharing';
import { RetailerServices } from '../services/mockserver/retailerService/retailer-services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertServices } from '../services/alertService/alert-services';
import { StartShopping } from '../classes/StartShoppingDTO';
import { Cartservices } from '../services/mockserver/cartservice/cartservices';
import { StartShoppingResponse } from '../classes/StartShoppingResponse';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IONIC_UI, LoginComponent, CommonModule, FormsModule],
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
    this.alertService.showBudgetConfirmation(
      // OK pressed
      () => {
        this.alertService.showBudgetInput((budget) => {
          this.budget = budget | 0;
          if (this.budget > 0) {
            this.alertService.showAlert(
              'Budget Set',
              this.budget
                ? `You have set a budget of ${this.budget}.
You can change your budget from the profile section.`
                : `No budget was set for this transaction.
You can set or change your budget later from the profile section.`,
              ['OK'],
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
        this.disableRetailerButton();
      },
    );
  }

  //receiving the login response via subscribing
  receiveLoginResponse() {
    this.dataSharing.loggedInUserInformation.subscribe((data) => {
      if (data) {
        this.login = data;
        this.receiveRetailers();
        this.shareCartInitResponse();
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
    this.cartService.initializeCart(shoppingDTO).subscribe((response) => {
      this.cartInitResponse = response;
      this.shareCartInitResponse();

      // this.router.navigate(['/scanitems']);
    });
  }
  // sharing the response object to cart component to retrieve
  // products from the cart for display
  shareCartInitResponse() {
    this.dataSharing.exchangeCartInitializationResponse(this.cartInitResponse);
  }

  enableRetailerButton() {
    this.dataSharing.updateRetailerButtonState(true);
  }

  // the following function disables the vendor button to prevent from multiple
  // carts being created by a single user
  disableRetailerButton() {
    this.dataSharing.updateRetailerButtonState(false);
  }
}
