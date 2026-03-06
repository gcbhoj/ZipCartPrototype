class ProductInformationDTO {
  constructor(
    itemNumber,
    productName,
    imageURL,
    price,
    weight,
    ingredients = [],
    manufacturedDate,
    expiryDate,
    manufacturer,
    aboutProduct,
    manufacturedIn,
  ) {
    this.itemNumber = itemNumber;
    this.productName = productName;
    this.imageURL = imageURL;
    this.price = price;
    this.weight = weight;
    this.ingredients = ingredients;
    this.manufacturedDate = manufacturedDate;
    this.expiryDate = expiryDate;
    this.manufacturer = manufacturer;
    this.aboutProduct = aboutProduct;
    this.manufacturedIn = manufacturedIn;
  }
}

export default ProductInformationDTO;
