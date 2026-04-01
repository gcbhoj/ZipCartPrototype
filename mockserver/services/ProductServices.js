import {
  getProductByUPC,
  getProductByItemNumber,
  getProductByName,
} from "../repository/ProductRepository.js";
import ProductInformationDTO from "../models/ProductInformationDTO.js";
import BarCodeRequest from "../models/BarcodeRequestDTO.js";
import PackagedProduct from "../models/PackagedProductModel.js";

const retrieveProductByUPC = async (barCodeRequest) => {
  if (barCodeRequest.isValid == false) {
    throw new Error("INVALID BARCODE");
  } else if (barCodeRequest.text == null || barCodeRequest.text == "") {
    throw new Error("GIVEN BARCODE IS NULL OR EMPTY");
  }

  const product = await getProductByUPC(barCodeRequest.text);
  if (!product) {
    throw new Error("NO PRODUCT FOUND BY PROVIDED UPC");
  }

  const response = new ProductInformationDTO(
    product.itemNumber,
    product.productName,
    product.productId,
    product.imageURL,
    product.price,
    product.weight,
    product.ingredients,
    product.manufacturedDate,
    product.expiryDate,
    product.manufactureer,
    product.manufacturedIn,
    product.aboutProduct,
    product.quantity,
  );

  return response;
};

const retrieveProductByItemNumber = async (itemNumber) => {
  if (!itemNumber) {
    throw new Error("ITEM NUMBER IS REQUIRED");
  }

  const retrievedProduct = await getProductByItemNumber(itemNumber);

  if (!retrievedProduct) {
    throw new Error("NO ITEM FOUND BY ITEM NUMBER");
  }

  const product = new PackagedProduct(
    retrievedProduct.productId,
    retrievedProduct.productName,
    retrievedProduct.itemNumber,
    retrievedProduct.imageURL,
    retrievedProduct.quantity,
    retrievedProduct.price,
  );

  return product;
};

const retrieveProductByName = async (productName) => {
  if (!productName) {
    throw new Error("PRODUCT NAME IS REQUIRED");
  }

  const retrievedProduct = await getProductByName(productName);

  if (!retrievedProduct) {
    throw new Error("NO PRODUCT FOUND BY GIVEN NAME");
  }

  const product = new ProductInformationDTO(
    retrievedProduct.itemNumber,
    retrievedProduct.productName,
    retrievedProduct.productId,
    retrievedProduct.imageURL,
    retrievedProduct.price,
    retrievedProduct.weight,
    retrievedProduct.ingredients,
    retrievedProduct.manufacturedDate,
    retrievedProduct.expiryDate,
    retrievedProduct.manufactureer,
    retrievedProduct.aboutProduct,
    retrievedProduct.manufacturedIn,
    retrievedProduct.quantity,
  );

  return product;
};

// const result = await retrieveProductByName("apple");

// console.log(result);

export { retrieveProductByUPC, retrieveProductByItemNumber, getProductByName };
