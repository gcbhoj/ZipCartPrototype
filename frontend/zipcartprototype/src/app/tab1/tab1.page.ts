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
import { isEmpty } from 'rxjs';
import { Cartservices } from '../services/mockserver/cartservice/cartservices';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IONIC_UI, LoginComponent, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {
  userId: string = '';
  retailers: Retailer[] = [];
  budget: number = 0;
  cartId: string = '';

  constructor(
    private router: Router,
    private dataSharing: Datasharing,
    private retailerService: RetailerServices,
    private alertService: AlertServices,
    private cartService: Cartservices,
  ) {}

  ngOnInit(): void {
    this.receiveUserId();
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
            this.userId,
            retailerId,
            this.budget,
          );

          this.initializeCartForShopper(dto);
        });
      },

      // Cancel pressed
      () => {
        const dto = this.mapToStartShoppingDTO(
          this.userId,
          retailerId,
          this.budget,
        );

        this.initializeCartForShopper(dto);
      },
    );
  }

  // receiving userid of logged in user
  receiveUserId() {
    this.dataSharing.currentUserId.subscribe((data) => {
      if (data) {
        this.userId = data;
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

  initializeCartForShopper(shoppingDTO: StartShopping) {
    this.cartService.initializeCart(shoppingDTO).subscribe((response) => {
      this.cartId = response.cartId;

      this.alertService.showAlert('Cart Created', response.message, ['OK']);

      console.log('Cart ID:', this.cartId);

      this.router.navigate(['/scanitems']);
    });
  }
}
