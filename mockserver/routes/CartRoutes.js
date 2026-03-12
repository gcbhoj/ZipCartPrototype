import express from "express";
const cartRoutes = express.Router();

import {
  fetchCartById,
  initializeCartForShopper,
  addPackagedProduct,
} from "../controllers/CartController.js";

cartRoutes.get("/retrieve/:cartId", fetchCartById);
cartRoutes.post("/initialize", initializeCartForShopper);
cartRoutes.post("/add-packaged", addPackagedProduct);

export default cartRoutes;
