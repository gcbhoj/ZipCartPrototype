import CartInitializationRequest from "../models/CartInitializationRequest.js";
import CartInitializationResponse from "../models/CartInitializationResponseDTO.js";
import PackagedProduct from "../models/PackagedProductModel.js";
import AddPackagedProductResponse from "../models/AddPackagedProductResponseDTO.js";
import {
  retrieveCartById,
  initializeNewCart,
  addPackagedProductToCart,
} from "../services/CartService.js";

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

export { fetchCartById, initializeCartForShopper,addPackagedProduct };
