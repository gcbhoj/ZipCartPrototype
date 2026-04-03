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
} from "../repository/CartRepository.js";
import { v4 as uuidv4 } from "uuid";
import CartInitializationResponse from "../models/CartInitializationResponseDTO.js";
import { getRetailerById } from "../repository/RetailerRepository.js";
import { retrieveProductByItemNumber } from "../services/ProductServices.js";
import { retrieveUserById } from "./UserService.js";
import { it } from "node:test";
import LiveWeightResponse from "../models/LiveWeightResponseDTO.js";

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

  // 🔥 simulate weight (replace with real machine logic)
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

// const response = await getProductLiveWeight(
//   "33daec91-90e5-48ed-9f6d-fa121f4f6520",
//   "1a2b3c4d-0005-4f5e-b123-abcdef000005",
// );
// console.log(response);

export {
  initializeNewCart,
  retrieveCartById,
  addPackagedProductToCart,
  increasePackagedProductQuantity,
  decreasePackagedProductQuantity,
  removePackagedItem,
  getProductLiveWeight,
};
