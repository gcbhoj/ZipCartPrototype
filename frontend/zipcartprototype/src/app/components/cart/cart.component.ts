/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { PackagedProduct } from '../../classes/PackagedProduct';
import { UnPackagedProduct } from './../../classes/UnPackagedProduct';
import { Cart } from '../../classes/Cart';
import { Cartservices } from '../../services/mockserver/cartservice/cartservices';
import { Datasharing } from '../../services/datasharing/datasharing';
import { PackageditemComponent } from '../packageditem/packageditem.component';
import { UnpackageditemComponent } from '../unpackageditem/unpackageditem.component';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';
import { StartShoppingResponse } from 'src/app/classes/StartShoppingResponse';
import { LoginResponse } from 'src/app/classes/LoginResponseDTO';
import { CommonModule } from '@angular/common';
import { car } from 'ionicons/icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [PackageditemComponent, UnpackageditemComponent, CommonModule],
})
export class CartComponent implements OnInit {
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
  //initializing variables to store and display
  totalPackagedProduct: number = 0;
  totalUnPackagedProduct: number = 0;
  totalCartAmountBeforeTax: number = 0;
  taxAmount: number = 0;
  totalCartAmount: number = 0;
  constructor(
    private cartService: Cartservices,
    private dataSharing: Datasharing,
    private calculator: CalculatorService,
  ) {}

  ngOnInit() {
    this.receiveLoginResponse();
    this.receiveCartInitResponse();
    this.fetchCartByCartId(this.cartInitResponse.cartId);
  }

  // receiving cart initialization response
  receiveCartInitResponse() {
    this.dataSharing.startShoppingResponseDetails.subscribe((data) => {
      if (data) {
        this.cartInitResponse = data;
      }
    });
  }
  //receiving the login response via subscribing
  receiveLoginResponse() {
    this.dataSharing.loggedInUserInformation.subscribe((data) => {
      if (data) {
        this.login = data;
      }
    });
  }

  fetchCartByCartId(cartId: string) {
    this.cartService.getCartByCartId(cartId);
    this.cartService.cart$.subscribe((cart: Cart | null) => {
      if (cart) {
        this.completeCart = cart;
        this.packagedProduct = cart.packagedProducts;
        this.unpackagedProduct = cart.unpackagedProducts;
      }
      this.sharePackagedProduct();
      this.shareUnPackagedProduct();
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.totalPackagedProduct =
      this.calculator.calculateTotalAmountPackagedItems(this.packagedProduct);

    this.totalUnPackagedProduct =
      this.calculator.calculateTotalAmountUnPackagedItems(
        this.unpackagedProduct,
      );

    this.totalCartAmountBeforeTax = this.calculator.calculateTotalCartAmount(
      this.totalPackagedProduct,
      this.totalUnPackagedProduct,
    );

    this.taxAmount = this.calculator.calculateTaxAmount(
      this.totalCartAmountBeforeTax,
    );

    this.totalCartAmount = this.calculator.calculateTotalAmount(
      this.totalCartAmountBeforeTax,
      this.taxAmount,
    );
  }

  // sharing the packaged products received from the cart to display in packaged product component
  sharePackagedProduct() {
    this.dataSharing.exchangePackagedProduct(this.packagedProduct);
  }

  // sharing the unpackaged products received from the cart to display in unpackaged product component
  shareUnPackagedProduct() {
    this.dataSharing.exchangeUnPackagedProduct(this.unpackagedProduct);
  }
}
