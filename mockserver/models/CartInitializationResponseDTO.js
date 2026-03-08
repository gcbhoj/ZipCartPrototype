class CartInitializationResponse {
  constructor(cartId, retailerName, budget, message) {
    this.cartId = cartId;
    this.retailerName = retailerName;
    this.budget = budget;
    this.message = message;
  }
}

export default CartInitializationResponse;
