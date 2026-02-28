class PackagedProduct {
  constructor(
    productName,
    itemNumber,
    imageUrl,
    quantity,
    unitPrice,
    totalPrice,
  ) {
    this.productName = productName;
    this.itemNumber = itemNumber;
    this.imageUrl = imageUrl;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.totalPrice = totalPrice;
  }
}

export default PackagedProduct;
