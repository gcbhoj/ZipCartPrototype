import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { PackagedProduct } from '../../classes/Models/PackagedProduct';
import { UnPackagedProduct } from '../../classes/Models/UnPackagedProduct';
import { Cart } from 'src/app/classes/Models/Cart';
import { Datasharing } from '../../services/datasharing/datasharing';
import { PackageditemComponent } from '../packageditem/packageditem.component';
import { UnpackageditemComponent } from '../unpackageditem/unpackageditem.component';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { LoginResponse } from 'src/app/classes/DTOs/LoginResponseDTO';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { BarcodeDisplayComponent } from '../barcode-display/barcode-display.component';
import { ToastServices } from 'src/app/services/toastService/toast-services';
import { BarcodeService } from 'src/app/services/springServices/barcodeServices/barcode-service';
import { CartService } from 'src/app/services/springServices/cartServices/cart-service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [
    PackageditemComponent,
    UnpackageditemComponent,
    CommonModule,
    IonicModule,
  ],
})
export class CartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  /**
   * initializing cart id to receive the cart id to be shared to packaged product
   * and unpackaged componet to handle CRUD operations based on cart id
   *  */
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

  // initializing the cart interface to share packaged product and unpackaged product
  completeCart!: Cart;
  //initializing the packaged product component as an empty array to receive and share
  packagedProduct: PackagedProduct[] = [];
  // initializing the unpackaged product component as an empty array to receive and share
  unpackagedProduct: UnPackagedProduct[] = [];
  //initializing variables to store and display product total

  totalPackagedProduct: number = 0;
  totalUnPackagedProduct: number = 0;
  totalCartAmountBeforeTax: number = 0;
  taxAmount: number = 0;
  totalCartAmount: number = 0;

  finalImageSrc: string = '';
  constructor(
    private dataSharing: Datasharing,
    private calculator: CalculatorService,
    private modalCtrl: ModalController,
    private toast: ToastServices,
    private zone: NgZone,
    private barCodeService: BarcodeService,
    private cartServices: CartService,
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.receiveLoginResponse();
    this.receiveCartInitResponse();
    this.receivePackagedProductTotal();
    this.receiveUnPackagedProductTotal();
  }
  /**
   * DATA SHARING
   */

  // receiving cart initialization response
  receiveCartInitResponse() {
    this.dataSharing.startShoppingResponseDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.cartInitResponse = data;
          this.fetchCartByCartId(this.cartInitResponse.cartId);
        }
      });
  }
  //receiving the login response via subscribing
  receiveLoginResponse() {
    this.dataSharing.loggedInUserInformation
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.login = data;
        }
      });
  }

  // sharing the packaged products received from the cart to display in packaged product component
  sharePackagedProduct() {
    this.dataSharing.exchangePackagedProduct(this.packagedProduct);
  }

  // sharing the unpackaged products received from the cart to display in unpackaged product component
  shareUnPackagedProduct() {
    this.dataSharing.exchangeUnPackagedProduct(this.unpackagedProduct);
  }

  // receive Packaged Product total
  receivePackagedProductTotal() {
    this.dataSharing.PackagedProductTotal$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((data) => {
      if (data !== null && data !== undefined) {
        this.totalPackagedProduct = data;
      }
      this.performCalculations();
    });
  }
  // receive unpackaged Product total
  receiveUnPackagedProductTotal() {
    this.dataSharing.unPackagedProductTotal$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data !== null && data !== undefined) {
          this.totalUnPackagedProduct = data;
        }
        this.performCalculations();
      });
  }

  enableRetailerButton() {
    this.zone.run(() => {
      this.dataSharing.updateRetailerButtonState(true);
    });
  }

  /**
   *API CALLS
   *
   * @param cartId
   *  GET REQUEST TO FETCH CART BY ID
   */

  fetchCartByCartId(cartId: string) {
    this.cartServices.getCartByCartId(cartId);
    this.cartServices.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart: Cart | null) => {
        if (cart) {
          this.completeCart = cart;
          this.packagedProduct = cart.packagedProducts;
          this.unpackagedProduct = cart.unpackagedProducts;
          this.sharePackagedProduct();
          this.shareUnPackagedProduct();
          this.performCalculations();
        }
      });
  }

  // COMPLETE SHOPPING
  async completeShopping() {
    this.cartServices
      .completeShopping(this.cartInitResponse.cartId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          this.finalImageSrc = URL.createObjectURL(blob);
          this.openModal();
          this.enableRetailerButton();
        },
        error: (err) => {
          const message =
            err?.error?.message ||
            'Unable to generate Barcode. Please try again';
          this.toast.showError(message);
        },
      });
  }

  /**
   * CALLING CALCULATOR SERVICE TO CALCULATE THE TOTAL AMOUNT AND TAXES PAYABLE
   */

  performCalculations() {
    this.totalCartAmountBeforeTax = this.calculator.performAddition(
      this.totalPackagedProduct,
      this.totalUnPackagedProduct,
    );
    this.taxAmount = this.calculator.calculateTaxAmount(
      this.totalCartAmountBeforeTax,
    );
    this.totalCartAmount = this.calculator.performAddition(
      this.taxAmount,
      this.totalCartAmountBeforeTax,
    );
  }
  /**
   * MODAL TO DISPLAY THE FINAL BAR CODE
   */

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: BarcodeDisplayComponent,
      componentProps: {
        finalImageSrc: this.finalImageSrc,
      },
    });

    modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm') {
      console.log('CONFIRM PRESSED');
    }
  }
}
