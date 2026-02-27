import express from "express";
const userRoutes = express.Router();

import { addNewUser, getAllUsers } from "./UserController.js";

userRoutes.post("/register", addNewUser);
userRoutes.get("/get_all_users", getAllUsers);

export default userRoutes;
