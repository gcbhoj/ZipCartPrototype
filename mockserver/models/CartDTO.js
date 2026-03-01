import PackagedProduct from "./PackagedProductModel.js";
import UnpackagedProduct from "./UnPackagedProductModel.js";

class CartDTO {
  constructor(
    cartId,
    userId,
    packagedProducts = [],
    unpackagedProducts = [],
    hst,
    totalAmount,
  ) {
    this.cartId = cartId;
    this.userId = userId;
    this.packagedProducts = packagedProducts;
    this.unpackagedProducts = unpackagedProducts;
    this.hst = hst;
    this.totalAmount = totalAmount;
  }
}

export default CartDTO;
