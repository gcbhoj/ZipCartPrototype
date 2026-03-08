import express from "express";
const cartRoutes = express.Router();

import {
  fetchCartById,
  initializeCartForShopper,
} from "../controllers/CartController.js";

cartRoutes.get("/retrieve/:cartId", fetchCartById);
cartRoutes.post("/initialize", initializeCartForShopper);

export default cartRoutes;
