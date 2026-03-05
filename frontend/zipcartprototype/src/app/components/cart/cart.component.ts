import { Component, OnInit } from '@angular/core';
import { PackagedProduct } from '../../classes/PackagedProduct';
import { UnPackagedProduct } from './../../classes/UnPackagedProduct';
import { Cart } from '../../classes/Cart';
import { Cartservices } from '../../services/mockserver/cartservice/cartservices';
import { Datasharing } from '../../services/datasharing/datasharing';
import { PackageditemComponent } from '../packageditem/packageditem.component';
import { UnpackageditemComponent } from '../unpackageditem/unpackageditem.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [PackageditemComponent, UnpackageditemComponent],
})
export class CartComponent implements OnInit {
  userId: string | null = '';
  cartId!: string;
  completeCart!: Cart;
  packagedProduct: PackagedProduct[] = [];
  unpackagedProduct: UnPackagedProduct[] = [];
  constructor(
    private cartService: Cartservices,
    private dataSharing: Datasharing,
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
    this.cartService.getCartByUserId(userId);

    this.cartService.cart$.subscribe((cart: Cart | null) => {
      if (cart) {
        this.completeCart = cart;
        this.packagedProduct = cart.packagedProducts;
        this.unpackagedProduct = cart.unpackagedProducts;
      }
      this.shareCartId();
      this.sharePackagedProduct();
      this.shareUnPackagedProduct();
    });
  }

  // Sharing the cart Id
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
