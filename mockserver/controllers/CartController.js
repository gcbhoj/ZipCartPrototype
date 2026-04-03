import CartInitializationRequest from "../models/CartInitializationRequest.js";
import CartInitializationResponse from "../models/CartInitializationResponseDTO.js";
import PackagedProduct from "../models/PackagedProductModel.js";
import AddPackagedProductResponse from "../models/AddPackagedProductResponseDTO.js";
import {
  retrieveCartById,
  initializeNewCart,
  addPackagedProductToCart,
  increasePackagedProductQuantity,
  decreasePackagedProductQuantity,
  removePackagedItem,
  getProductLiveWeight,
  addWeighedItemToCart,
  removeWeighedProduct,
} from "../services/CartService.js";
import { getProductByName } from "../services/ProductServices.js";
import fs from "fs";

const initializeCartForShopper = async (req, res) => {
  try {
    const { userId, retailerId, budget } = req.body;
    const request = new CartInitializationRequest(userId, retailerId, budget);
    const response = await initializeNewCart(request);
    if (!response) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    return res.status(200).json(response);
  } catch (error) {
    switch (error.message) {
      case "CANNOT INITIALIZE CART INVALID INPUT":
      case "CANNOT FIND SHOPPER BY GIVEN ID":
      case "CANNOT FIND RETAILOR BY GIVEN ID":
      case "UNABLE TO FIND CART BY ID":
        return res.status(400).json({ message: error.message });
      case "YOU ALREADY HAVE AN OPEN CART. DEAL WITH IT FIRST":
        return res.status(404).json({ message: error.message });
      case "UNABLE TO INITIALIZE NEW SHOPPING CART":
      case "UNABLE TO INITIALIZE CART":
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });

      default:
        return res.status(500).json({ message: "internal server error" });
    }
  }
};

const fetchCartById = async (req, res) => {
  try {
    const { cartId } = req.params;

    const response = await retrieveCartById(cartId);

    if (!response) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    return res.status(200).json(response);
  } catch (error) {
    switch (error.message) {
      case "CART ID IS REQUIRED":
      case "UNABLE TO RETRIEVE CART BY GIVEN ID":
        return res.status(400).json({ message: error.message });
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });

      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

const addPackagedProduct = async (req, res) => {
  try {
    const { cartId, itemId } = req.body;

    const result = await addPackagedProductToCart(cartId, itemId);

    if (!result) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    const response = new AddPackagedProductResponse(result);

    return res.status(200).json(response);
  } catch (error) {
    switch (error) {
      case "CART NOT FOUND":
      case "INVALID DATA":
      case "CART ID IS REQUIRED":
      case "UNABLE TO RETRIEVE CART BY GIVEN ID":
      case "PRODUCT IS NOT AN INSTANCE OF PACKAGED PRODUCT":
        return res.status(400).json({ message: error.message });
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });

      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

const increaseQuantity = async (req, res) => {
  try {
    const { cartId, itemId } = req.body;
    console.log(cartId, itemId);

    const result = await increasePackagedProductQuantity(cartId, itemId);

    if (!result) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    const response = new AddPackagedProductResponse(result);

    return res.status(200).json(response);
  } catch (error) {
    switch (error) {
      case "CART NOT FOUND":
      case "PRODUCT NOT FOUND IN CART":
      case "CART ID IS REQUIRED":
      case "ITEM ID IS REQUIRED":
        return res.status(400).json({ message: error.message });
      case "UNABLE TO INCREASE PRODUCT QUANTITY":
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });
      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    const { cartId, itemId } = req.body;

    const result = await decreasePackagedProductQuantity(cartId, itemId);

    if (!result) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    const response = new AddPackagedProductResponse(result);

    return res.status(200).json(response);
  } catch (error) {
    switch (error) {
      case "CART NOT FOUND":
      case "PRODUCT NOT FOUND IN CART":
      case "CART ID IS REQUIRED":
      case "ITEM ID IS REQUIRED":
        return res.status(400).json({ message: error.message });
      case "UNABLE TO DECREASE PRODUCT QUANTITY":
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });
      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

const removePackagedProduct = async (req, res) => {
  try {
    const { cartId, itemId } = req.body;

    const result = await removePackagedItem(cartId, itemId);

    if (!result) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    const response = new AddPackagedProductResponse(result);

    return res.status(200).json(response);
  } catch (error) {
    switch (error) {
      case "CART NOT FOUND":
      case "NO PRODUCTS IN CART":
      case "PRODUCT NOT FOUND IN CART":
      case "CART ID IS REQUIRED":
      case "ITEM ID IS REQUIRED":
        return res.status(400).json({ message: error.message });
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });
      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

const retrieveProductByProductName = async (req, res) => {
  try {
    const { productName } = req.params;

    const result = await getProductByName(productName);

    if (!result) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    return res.status(200).json(result);
  } catch (error) {
    switch (error) {
      case "PRODUCT NAME IS REQUIRED":
      case "NO PRODUCT FOUND BY GIVEN NAME":
        return res.status(400).json({ message: error.message });
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });
      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

const fetchProductLiveWeight = async (req, res) => {
  try {
    const { machineId, itemId } = req.body;

    const response = await getProductLiveWeight(machineId, itemId);

    if (!response) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    return res.status(200).json(response);
  } catch (error) {
    switch (error) {
      case "ITEM NUMBER CANNOT BE NULL":
      case "NO PRODUCT FOUND BY GIVEN ITEM NUMBER":
        return res.status(400).json({ message: error.message });
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });
      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

const addWeighedProductToCart = async (req, res) => {
  try {
    const { cartId, weight, itemId } = req.body;

    const result = await addWeighedItemToCart(cartId, weight, itemId);

    if (!result) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    return res.status(200).json({ result });
  } catch (error) {
    switch (error) {
      case "CART NOT FOUND":
      case "INVALID DATA":
      case "CART ID CANNOT BE NULL":
      case "WEIGHT CANNOT BE NULL":
      case "ITEM NUMBER CANNOT BE NULL":
      case "NO CART FOUND BY GIVEN ID":
      case "NO PRODUCT FOUND BY GIVEN ID":
        return res.status(400).json({ message: error.message });
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });
      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

const deleteWeighedProduct = async (req, res) => {
  try {
    const { cartId, itemId } = req.body;

    const result = await removeWeighedProduct(cartId, itemId);

    if (!result) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    return res.status(200).json({ result });
  } catch (error) {
    switch (error) {
      case "CART NOT FOUND":
      case "NO PRODUCTS IN CART":
      case "CART ID CANNOT BE EMPTY":
      case "ITEM ID CANNOT BE EMPTY":
        return res.status(400).json({ message: error.message });
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });
      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

export {
  fetchCartById,
  initializeCartForShopper,
  addPackagedProduct,
  increaseQuantity,
  decreaseQuantity,
  removePackagedProduct,
  retrieveProductByProductName,
  fetchProductLiveWeight,
  addWeighedProductToCart,
  deleteWeighedProduct,
};
