import CartInitializationRequest from "../models/CartInitializationRequest.js";
import CartInitializationResponse from "../models/CartInitializationResponseDTO.js";
import PackagedProduct from "../models/PackagedProductModel.js";
import AddPackagedProductResponse from "../models/AddPackagedProductResponseDTO.js";
import {
  retrieveCartById,
  initializeNewCart,
  addPackagedProductToCart,
  updatePackagedProductItemQuantity,
  removePackagedItem,
} from "../services/CartService.js";
import UpdatePackagedProductQuantityResponse from "../models/UpdatePackagedProductResponseDTO.js";
import RemovePackagedProductResponse from "../models/RemovePackagedProductResponseDTO.js";

const initializeCartForShopper = async (req, res) => {
  try {
    const { userId, retailerId, budget } = req.body;
    const request = new CartInitializationRequest(userId, retailerId, budget);
    console.log(request);
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

const updatePackedProductQuantity = async (req, res) => {
  try {
    const { cartId, itemId, quantity } = req.body;

    const result = await updatePackagedProductItemQuantity(
      cartId,
      itemId,
      quantity,
    );

    if (!result) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    const response = new UpdatePackagedProductQuantityResponse(result);

    return res.status(200).json(response);
  } catch (error) {
    switch (error) {
      case "CART NOT FOUND":
      case "ITEM NOT FOUND":
      case "CART ID IS REQUIRED":
      case "ITEM ID IS REQUIRED":
      case "QUANTITY IS REQUIRED AND MUST BE A NUMBER":
      case "UNABLE TO UPDATE ITEM QUANTITY":
        return res.status(400).json({ message: error.message });
      case "INTERNAL SERVER ERROR":
        return res.status(500).json({ message: error.message });
      default:
        return res.status(500).json({ message: error.message });
    }
  }
};

const deletePackagedProduct = async (req, res) => {
  try {
    const { cartId, itemId } = req.body;

    const result = await removePackagedItem(cartId, itemId);

    if (!result) {
      throw new Error("INTERNAL SERVER ERROR");
    }

    const response = new RemovePackagedProductResponse(result);

    return res.status(200).json(response);
  } catch (error) {
    switch (error) {
      case "CART NOT FOUND":
      case "ITEM NOT FOUND":
      case "CART ID IS REQUIRED":
      case "ITEM ID IS REQUIRED":
        return res.status(400).json({ message: error.message });
      case "UNABLE TO UPDATE PRODUCT":
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
  updatePackedProductQuantity,
  deletePackagedProduct,
};
