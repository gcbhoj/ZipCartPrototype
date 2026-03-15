/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { PackagedProduct } from '../../classes/Models/PackagedProduct';
import { UnPackagedProduct } from '../../classes/Models/UnPackagedProduct';
import { Cart } from 'src/app/classes/Models/Cart';
import { Cartservices } from '../../services/mockserver/cartservice/cartservices';
import { Datasharing } from '../../services/datasharing/datasharing';
import { PackageditemComponent } from '../packageditem/packageditem.component';
import { UnpackageditemComponent } from '../unpackageditem/unpackageditem.component';
import { CalculatorService } from 'src/app/services/calculatorService/calculator-service';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { LoginResponse } from 'src/app/classes/DTOs/LoginResponseDTO';
import { CommonModule } from '@angular/common';

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
  //initializing variables to store and display product total

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
    this.receivePackagedProductTotal();
  }
  /**
   * DATA SHARING
   */

  // receiving cart initialization response
  receiveCartInitResponse() {
    this.dataSharing.startShoppingResponseDetails.subscribe((data) => {
      if (data) {
        this.cartInitResponse = data;
        this.fetchCartByCartId(this.cartInitResponse.cartId);
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
    this.dataSharing.PackagedProductTotal$.subscribe((data) => {
      if (data !== null) {
        this.totalPackagedProduct = data;
        console.log('PACKAGED PRODUCT TOTAL', this.totalPackagedProduct);
      }
      this.totalCartAmountBeforeTax = this.calculator.performAddition(
        this.totalPackagedProduct,
        this.totalUnPackagedProduct,
      );
      this.taxAmount = this.calculator.calculateTaxAmount(
        this.totalCartAmountBeforeTax,
      );
      console.log('CART TAX AMOUNT', this.taxAmount);

      this.totalCartAmount = this.calculator.performAddition(
        this.taxAmount,
        this.totalCartAmountBeforeTax,
      );

      console.log('TOTAL AMOUNT AFTER TAX', this.totalCartAmount);
    });
  }

  /**
   *
   * @param cartId
   *  GET REQUEST TO FETCH CART BY ID
   */

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
    });
  }

  /**
   * CALLING CALCULATOR SERVICE TO CALCULATE THE TOTAL AMOUNT AND TAXES PAYABLE
   */
}
