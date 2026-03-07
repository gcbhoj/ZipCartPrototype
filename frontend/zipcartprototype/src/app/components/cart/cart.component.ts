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

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [PackageditemComponent, UnpackageditemComponent],
})
export class CartComponent implements OnInit {
  //initializing user Id to receive user id after login
  userId: string | null = '';
  /**
   * initializing cart id to receive the cart id to be shared to packaged product
   * and unpackaged componet to handle CRUD operations based on cart id
   *  */

  cartId!: string;
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
    this.receiveUserId();
  }
  // Receiving user Id from sharing services
  receiveUserId() {
    this.dataSharing.currentUserId.subscribe((data) => {
      this.userId = data;
      if (this.userId) {
        this.fetchCartByUser(this.userId);
      }
    });
  }
  // Fetching the cart by user Id
  fetchCartByUser(userId: string) {
    //receiving cartid from cart service
    this.cartService.getCartByUserId(userId);
    //subscribing to the cart service for any updates on the cart
    this.cartService.cart$.subscribe((cart: Cart | null) => {
      if (cart) {
        this.completeCart = cart;
        this.packagedProduct = cart.packagedProducts;
        this.unpackagedProduct = cart.unpackagedProducts;
      }
      //sharing the cart id
      this.shareCartId();
      //sharing packaged product
      this.sharePackagedProduct();
      //sharing unpackaged product
      this.shareUnPackagedProduct();
      //calculating the total amount of the packaged product in the cart
      this.totalPackagedProduct =
        this.calculator.calculateTotalAmountPackagedItems(this.packagedProduct);
      //calculating the total amount of the unpackaged product in the cart
      this.totalUnPackagedProduct =
        this.calculator.calculateTotalAmountUnPackagedItems(
          this.unpackagedProduct,
        );
      // calculating the total amount for the cart items
      this.totalCartAmountBeforeTax = this.calculator.calculateTotalCartAmount(
        this.totalPackagedProduct,
        this.totalUnPackagedProduct,
      );
      // calculating the total tax amount with 13% HST
      this.taxAmount = this.calculator.calculateTaxAmount(
        this.totalCartAmountBeforeTax,
      );
      // calculating the total payable amount
      this.totalCartAmount = this.calculator.calculateTotalAmount(
        this.totalCartAmountBeforeTax,
        this.taxAmount,
      );
    });
  }

  // using data sharing to share cartId
  shareCartId() {
    if (this.completeCart) {
      this.cartId = this.completeCart.cartId;
      this.dataSharing.exchangeCartId(this.cartId);
    }
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
