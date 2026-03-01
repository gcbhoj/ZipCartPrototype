import PackagedProduct from "./PackagedProductModel.js";
import UnpackagedProduct from "./UnPackagedProductModel.js";

class Cart {
  constructor(
    cartId,
    storeName,
    userId,
    packagedProducts = [],
    unpackagedProducts = [],
    status,
    hst,
    totalAmount,
    transactionDateAndTime,
  ) {
    this.cartId = cartId;
    this.storeName = storeName;
    this.userId = userId;
    this.packagedProducts = packagedProducts;
    this.unpackagedProducts = unpackagedProducts;
    this.status = status;
    this.hst = hst;
    this.totalAmount = totalAmount;
    this.transactionDateAndTime = transactionDateAndTime;
  }
}

export default Cart;
