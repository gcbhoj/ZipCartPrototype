import express from "express";
const cartRoutes = express.Router();

import {
  fetchCartById,
  initializeCartForShopper,
  addPackagedProduct,
  updatePackedProductQuantity,
} from "../controllers/CartController.js";

cartRoutes.get("/retrieve/:cartId", fetchCartById);
cartRoutes.post("/initialize", initializeCartForShopper);
cartRoutes.patch("/add-packaged", addPackagedProduct);
cartRoutes.patch("/update-qty", updatePackedProductQuantity);

export default cartRoutes;
