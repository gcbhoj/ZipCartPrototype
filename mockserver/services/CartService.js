import PackagedProduct from "../models/PackagedProductModel.js";
import UnpackagedProduct from "../models/UnPackagedProductModel.js";
import Cart from "../models/CartModel.js";
import CartDTO from "../models/CartDTO.js";
import {
  addNewCart,
  getCartById,
  getOpenCartsByUser,
  addPackagedItemToCart,
  setPackagedProductQty,
  removePackageItemFromCart,
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

const updatePackagedProductItemQuantity = async (cartId, itemId, quantity) => {
  if (!cartId) {
    throw new Error("CART ID IS REQUIRED");
  }
  if (!itemId) {
    throw new Error("ITEM ID IS REQUIRED");
  }
  if (!quantity && quantity !== isNaN) {
    throw new Error("QUANTITY IS REQUIRED AND MUST BE A NUMBER");
  }
  const result = await setPackagedProductQty(cartId, itemId, quantity);

  if (!result) {
    throw new Error("UNABLE TO UPDATE ITEM QUANTITY");
  }
  return "PRODUCT QUANTITY UPDATED SUCCESSFULLY";
};

// const cartId = "b2c3d4e5-f6a7-4890-91bc-def123456789";
// const itemNumber = "411c3366-81ba-47ee-9932-0576f641c5e7";

// const response = await updatePackagedProductItemQuantity(cartId, itemNumber, 5);
// console.log(response);

export {
  initializeNewCart,
  retrieveCartById,
  addPackagedProductToCart,
  updatePackagedProductItemQuantity,
};
