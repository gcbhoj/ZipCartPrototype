import express from "express";
const userRoutes = express.Router();

import {
  addNewUser,
  getAllUsers,
  logInUser,
} from "../controllers/UserController.js";

userRoutes.post("/register", addNewUser);
userRoutes.get("/get_all_users", getAllUsers);
userRoutes.get("/authenticate/:userId", logInUser);

export default userRoutes;
