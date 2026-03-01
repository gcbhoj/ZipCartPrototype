import express from "express";
const cartRoutes = express.Router();

import { retrieveCartByUser } from "../controllers/CartController.js";

cartRoutes.get("/retrieve/:userId", retrieveCartByUser);

export default cartRoutes;
