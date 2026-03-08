import PackagedProduct from "./PackagedProductModel.js";
import UnpackagedProduct from "./UnPackagedProductModel.js";

class CartDTO {
  constructor(
    cartId,
    retailerId,
    budget,
    userId,
    packagedProducts = [],
    unpackagedProducts = [],
  ) {
    this.cartId = cartId;
    this.retailerId = retailerId;
    this.budget = budget;
    this.userId = userId;
    this.packagedProducts = packagedProducts;
    this.unpackagedProducts = unpackagedProducts;
  }
}

export default CartDTO;
