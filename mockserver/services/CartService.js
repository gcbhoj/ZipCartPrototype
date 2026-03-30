import PackagedProduct from "../models/PackagedProductModel.js";
import UnpackagedProduct from "../models/UnPackagedProductModel.js";
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

// const response = await addPackagedProductToCart(
//   "1a9586d6-de98-41ff-a763-954425756b8e",
//   "0fb9aca5-326b-4df0-89f8-8b3cf81c12ee",
// );
// console.log(response);

export {
  initializeNewCart,
  retrieveCartById,
  addPackagedProductToCart,
  increasePackagedProductQuantity,
  decreasePackagedProductQuantity,
  removePackagedItem,
};
