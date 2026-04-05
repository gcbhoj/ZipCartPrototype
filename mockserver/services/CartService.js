import Cart from "../models/CartModel.js";
import CartDTO from "../models/CartDTO.js";
import {
  addNewCart,
  getCartById,
  getOpenCartsByUser,
  addPackagedItemToCart,
  increasePackagedItemQuantity,
  decreasePackagedItemQuantity,
  removePackagedProduct,
  addUnpackagedItemToCart,
  removeUnPackagedProduct,
} from "../repository/CartRepository.js";
import { v4 as uuidv4 } from "uuid";
import CartInitializationResponse from "../models/CartInitializationResponseDTO.js";
import { getRetailerById } from "../repository/RetailerRepository.js";
import { retrieveProductByItemNumber } from "../services/ProductServices.js";
import { retrieveUserById } from "./UserService.js";
import { it } from "node:test";
import LiveWeightResponse from "../models/LiveWeightResponseDTO.js";
import UnPackagedProduct from "../models/UnPackagedProductModel.js";
import { generateReceiptBarcode } from "./BarCodeGenerator.js";
import fs from "fs";

const initializeNewCart = async (cartInitializationRequest) => {
  if (!cartInitializationRequest) {
    throw new Error("CANNOT INITIALIZE CART INVALID INPUT");
  }

  const request = cartInitializationRequest;

  const newCart = new Cart(
    uuidv4(),
    request.retailerId,
    request.userId,
    "open",
    request.budget,
    [],
    [],
    new Date(),
  );

  const shopper = await retrieveUserById(request.userId);
  if (!shopper) {
    throw new Error("CANNOT FIND SHOPPER BY GIVEN ID");
  }

  const retailer = await getRetailerById(request.retailerId);
  if (!retailer) {
    throw new Error("CANNOT FIND RETAILOR BY GIVEN ID");
  }

  const existingCart = await getOpenCartsByUser(request.userId);

  if (existingCart) {
    throw new Error("YOU ALREADY HAVE AN OPEN CART. DEAL WITH IT FIRST");
  }

  const response = await addNewCart(newCart);

  if (!response) {
    throw new Error("UNABLE TO INITIALIZE CART");
  }

  const responseDTO = new CartInitializationResponse(
    response.cartId,
    retailer.retailerName,
    response.budget,
    "HAPPY SHOPPING",
  );

  return responseDTO;
};

const retrieveCartById = async (cartId) => {
  if (!cartId) {
    throw new Error("CART ID IS REQUIRED");
  }

  const result = await getCartById(cartId);

  if (!result) {
    throw new Error("UNABLE TO RETRIEVE CART BY GIVEN ID");
  }

  return result;
};

const addPackagedProductToCart = async (cartId, itemId) => {
  if (!cartId) {
    throw new Error("CART ID IS REQUIRED");
  }

  if (!itemId) {
    throw new Error("ITEM ID IS REQUIRED");
  }

  const product = await retrieveProductByItemNumber(itemId);

  if (!product) {
    throw new Error("NO PRODUCT FOUND BY ITEM ID");
  }

  const result = await addPackagedItemToCart(cartId, product);

  if (!result) {
    throw new Error("UNABLE TO ADD ITEM TO CART");
  }

  return "PRODUCT SUCCESSFULLY ADDED TO CART";
};

const increasePackagedProductQuantity = async (cartId, itemId) => {
  if (!cartId) {
    throw new Error("CART ID IS REQUIRED");
  }

  if (!itemId) {
    throw new Error("ITEM ID IS REQUIRED");
  }

  const product = await increasePackagedItemQuantity(cartId, itemId);

  if (!product) {
    throw new Error("UNABLE TO INCREASE PRODUCT QUANTITY");
  }

  return "PRODUCT QUANTITY INCREASED SUCCESSFULLY";
};

const decreasePackagedProductQuantity = async (cartId, itemId) => {
  if (!cartId) {
    throw new Error("CART ID IS REQUIRED");
  }

  if (!itemId) {
    throw new Error("ITEM ID IS REQUIRED");
  }

  const product = await decreasePackagedItemQuantity(cartId, itemId);

  if (!product) {
    throw new Error("UNABLE TO INCREASE PRODUCT QUANTITY");
  }

  return "PRODUCT QUANTITY DECREASED SUCCESSFULLY";
};

const removePackagedItem = async (cartId, itemId) => {
  if (!cartId) {
    throw new Error("CART ID IS REQUIRED");
  }

  if (!itemId) {
    throw new Error("ITEM ID IS REQUIRED");
  }

  const product = await removePackagedProduct(cartId, itemId);

  return "PRODUCT REMOVED SUCCESSFULLY";
};

const getProductLiveWeight = async (machineId, itemId) => {
  if (!itemId) {
    throw new Error("ITEM NUMBER CANNOT BE NULL");
  }

  const product = await retrieveProductByItemNumber(itemId);

  if (!product) {
    throw new Error("NO PRODUCT FOUND BY GIVEN ITEM NUMBER");
  }

  // simulate weight (replace with real machine logic)
  const weight = (Math.random() * 2).toFixed(2);

  const response = new LiveWeightResponse(
    product.itemNumber,
    product.productName,
    weight,
    product.unitPrice,
    product.imageUrl,
  );

  return response;
};

const addWeighedItemToCart = async (cartId, weight, itemNumber) => {
  if (!cartId) {
    throw new Error("CART ID CANNOT BE NULL");
  }

  if (!weight) {
    throw new Error("WEIGHT CANNOT BE NULL");
  }
  if (!itemNumber) {
    throw new Error("ITEM NUMBER CANNOT BE NULL");
  }

  const cart = await getCartById(cartId);

  if (!cart) {
    throw new Error("NO CART FOUND BY GIVEN ID");
  }

  const retrievedProduct = await retrieveProductByItemNumber(itemNumber);

  if (!retrievedProduct) {
    throw new Error("NO PRODUCT FOUND BY GIVEN ID");
  }

  const product = new UnPackagedProduct(
    retrievedProduct.productId,
    retrievedProduct.productName,
    itemNumber,
    retrievedProduct.imageUrl,
    weight,
    retrievedProduct.unitPrice,
  );

  const response = await addUnpackagedItemToCart(cartId, product);

  if (!response) {
    throw new Error("INTERNAL SERVER ERROR");
  }

  return "PRODUCT ADDED TO CART SUCCESSFULLY";
};

const removeWeighedProduct = async (cartId, itemId) => {
  if (!cartId) {
    throw new Error("CART ID CANNOT BE EMPTY");
  }

  if (!itemId) {
    throw new Error("ITEM ID CANNOT BE EMPTY");
  }

  const result = await removeUnPackagedProduct(cartId, itemId);

  if (!result) {
    throw new Error("INTERNAL SERVER ERROR");
  }

  return "PRODUCT REMOVED SUCCESSFULLY";
};

/**
 * Complete shopping process and generate QR code for the cart
 * @param {string} cartId
 * @returns {Promise<Buffer>} PNG buffer
 */

const completeShopping = async (cartId) => {
  if (!cartId) throw new Error("CART ID CANNOT BE NULL");

  const cart = await retrieveCartById(cartId);

  // Remove image URLs to reduce QR size
  const cleanCart = {
    ...cart,
    packagedProducts: (cart.packagedProducts || []).map(
      ({ image, ...rest }) => rest,
    ),
    unpackagedProducts: (cart.unpackagedProducts || []).map(
      ({ image, ...rest }) => rest,
    ),
  };

  const cartString = JSON.stringify(cleanCart);

  // Generate QR code PNG buffer
  const qrBuffer = await generateReceiptBarcode(cartString);

  return qrBuffer; // this is a PNG buffer
};

export default completeShopping;

// // Usage with top-level async
// (async () => {
//   const cartId = "b2c3d4e5-f6a7-4890-91bc-def123456789";

//   const response = await completeShopping(cartId);

//   // Save the QR code to a PNG
//   fs.writeFileSync("receipt-qr.png", response);

//   console.log("QR code generated and saved as receipt-qr.png");
// })();

export {
  initializeNewCart,
  retrieveCartById,
  addPackagedProductToCart,
  increasePackagedProductQuantity,
  decreasePackagedProductQuantity,
  removePackagedItem,
  getProductLiveWeight,
  addWeighedItemToCart,
  removeWeighedProduct,
  completeShopping,
};
