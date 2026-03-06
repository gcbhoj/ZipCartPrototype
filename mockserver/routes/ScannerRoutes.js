import express from "express";
const scannerRoutes = express.Router();

import { retrieveProductDetails } from "../controllers/ScannerController.js";

scannerRoutes.post("/scan", retrieveProductDetails);

export default scannerRoutes;
