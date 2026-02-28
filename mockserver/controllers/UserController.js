import RegistrationModel from "../models/RegistrationModel.js";
import {
  retrieveAllUsers,
  registerNewUser,
  retrieveUserById,
} from "../services/UserService.js";

const addNewUser = async (req, res) => {
  try {
    const regModel = new RegistrationModel(
      req.body.userName,
      req.body.userEmailAddress,
    );

    const response = await registerNewUser(regModel);

    return res.status(201).json(response);
  } catch (error) {
    switch (error.message) {
      case "Invalid registration data":
      case "User already exists":
        return res.status(400).json({ message: error.message });

      default:
        return res.status(500).json({ message: "internal server error" });
    }
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await retrieveAllUsers();
    // console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const logInUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await retrieveUserById(userId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

export { addNewUser, getAllUsers, logInUser };
