import express from "express";
import multer from "multer";
const cartRoutes = express.Router();

import {
  fetchCartById,
  initializeCartForShopper,
  addPackagedProduct,
  increaseQuantity,
  decreaseQuantity,
  removePackagedProduct,
  retrieveProductByProductName,
  fetchProductLiveWeight,
} from "../controllers/CartController.js";
const upload = multer({ dest: "uploads/" });

cartRoutes.get("/retrieve/:cartId", fetchCartById);
cartRoutes.post("/initialize", initializeCartForShopper);
cartRoutes.patch("/add-packaged", addPackagedProduct);
cartRoutes.post("/increase-packaged", increaseQuantity);
cartRoutes.post("/decrease-packaged", decreaseQuantity);
cartRoutes.patch("/remove-packaged", removePackagedProduct);
cartRoutes.get("/getByName/:productName", retrieveProductByProductName);
cartRoutes.post("/live-weight", fetchProductLiveWeight);

export default cartRoutes;
