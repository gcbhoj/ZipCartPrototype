import express from "express";
import multer from "multer";
const cartRoutes = express.Router();

import {
  fetchCartById,
  initializeCartForShopper,
  addPackagedProduct,
  getProductByImage,
} from "../controllers/CartController.js";
const upload = multer({ dest: "uploads/" });

cartRoutes.get("/retrieve/:cartId", fetchCartById);
cartRoutes.post("/initialize", initializeCartForShopper);
cartRoutes.patch("/add-packaged", addPackagedProduct);
cartRoutes.post("/upload", upload.single("file"), getProductByImage);

export default cartRoutes;
