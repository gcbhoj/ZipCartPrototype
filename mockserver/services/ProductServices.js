import { getProductByUPC } from "../repository/ProductRepository.js";
import ProductInformationDTO from "../models/ProductInformationDTO.js";
import BarCodeRequest from "../models/BarcodeRequestDTO.js";

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
    product.imageURL,
    product.price,
    product.weight,
    product.ingredients,
    product.manufacturedDate,
    product.expiryDate,
    product.manufactureer,
    product.manufacturedIn,
    product.aboutProduct,
  );

  return response;
};

export { retrieveProductByUPC };
