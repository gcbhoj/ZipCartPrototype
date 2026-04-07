import express from "express";
import { fetchAllMachines } from "../controllers/MachineController.js";

const machineRoutes = express.Router();

machineRoutes.get("/", fetchAllMachines);

export default machineRoutes;
