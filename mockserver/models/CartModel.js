import PackagedProduct from "./PackagedProductModel.js";
import UnpackagedProduct from "./UnPackagedProductModel.js";

class Cart {
  constructor(
    cartId,
    retailerId,
    userId,
    status,
    budget,
    packagedProducts = [],
    unpackagedProducts = [],
    transactionDateAndTime,
  ) {
    this.cartId = cartId;
    this.retailerId = retailerId;
    this.userId = userId;
    this.status = status;
    this.budget = budget;
    this.packagedProducts = packagedProducts;
    this.unpackagedProducts = unpackagedProducts;

    this.transactionDateAndTime = transactionDateAndTime;
  }
}

export default Cart;
