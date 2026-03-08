import PackagedProduct from "../models/PackagedProductModel.js";
import UnpackagedProduct from "../models/UnPackagedProductModel.js";
import Cart from "../models/CartModel.js";
import CartDTO from "../models/CartDTO.js";
import {
  addNewCart,
  getCartById,
} from "../repository/CartRepository.js";
import { v4 as uuidv4 } from "uuid";
import CartInitializationRequest from "../models/CartInitializationRequest.js";
import CartInitializationResponse from "../models/CartInitializationResponseDTO.js";
import { getRetailerById } from "../repository/RetailerRepository.js";
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
    throw new Error("UNABLE TO RETRIEVE CART BY GIVEN ID")
  }

  return result;
};

export { initializeNewCart, retrieveCartById };
