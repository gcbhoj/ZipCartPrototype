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
  addWeighedProductToCart,
  deleteWeighedProduct,
  sendQRCOde,
} from "../controllers/CartController.js";
const upload = multer({ dest: "uploads/" });

cartRoutes.get("/retrieve/:cartId", fetchCartById);
cartRoutes.post("/initialize", initializeCartForShopper);
cartRoutes.post("/add-packaged", addPackagedProduct);
cartRoutes.post("/increase-packaged", increaseQuantity);
cartRoutes.post("/decrease-packaged", decreaseQuantity);
cartRoutes.patch("/remove-packaged", removePackagedProduct);
cartRoutes.get("/getByName/:productName", retrieveProductByProductName);
cartRoutes.post("/live-weight", fetchProductLiveWeight);
cartRoutes.post("/add-weighed", addWeighedProductToCart);
cartRoutes.patch("/remove-weighed", deleteWeighedProduct);
cartRoutes.get("/complete/:cartId", sendQRCOde);

export default cartRoutes;
