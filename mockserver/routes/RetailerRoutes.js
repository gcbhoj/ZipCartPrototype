import express from "express";
const retailerRoutes = express.Router();

import { fetchAllRetailers } from "../controllers/RetailerController.js";

retailerRoutes.get("/retailers", fetchAllRetailers);

export default retailerRoutes;
