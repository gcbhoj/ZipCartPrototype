class ProductInformationDTO {
  constructor(
    itemNumber,
    productName,
    productId,
    imageURL,
    price,
    weight,
    ingredients = [],
    manufacturedDate,
    expiryDate,
    manufacturer,
    aboutProduct,
    manufacturedIn,
    quantity,
  ) {
    this.itemNumber = itemNumber;
    this.productName = productName;
    this.productId = productId;
    this.imageURL = imageURL;
    this.price = price;
    this.weight = weight;
    this.ingredients = ingredients;
    this.manufacturedDate = manufacturedDate;
    this.expiryDate = expiryDate;
    this.manufacturer = manufacturer;
    this.aboutProduct = aboutProduct;
    this.manufacturedIn = manufacturedIn;
    this.quantity = quantity;
  }
}

export default ProductInformationDTO;
