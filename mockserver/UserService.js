import { v4 as uuidv4 } from "uuid";
import User from "./UserModel.js";
import RegistrationModel from "./RegistrationModel.js";
import RegistrationResponseModel from "./RegistrationResponseModel.js";
import { getUserByEmail, addNewUser, getAllUsers } from "./UserRepository.js";

const registerNewUser = async (regModel) => {
  // 1. Validate DTO
  if (!regModel || !regModel.userName || !regModel.userEmailAddress) {
    throw new Error("Invalid registration data");
  }

  // 2. Check if user already exists by email
  const existingUser = await getUserByEmail(regModel.userEmailAddress);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 3. Create new User entity
  const newUser = new User(
    uuidv4(),
    regModel.userName,
    regModel.userEmailAddress,
  );

  // 4. Save user
  const savedUser = await addNewUser(newUser);

  // 5. Build response DTO
  const response = new RegistrationResponseModel(
    savedUser.userId,
    savedUser.userName,
    "User Registered Successfully",
  );

  return response;
};

const retrieveAllUsers = async () => {
  const result = await getAllUsers();

  if (!Array.isArray(result)) {
    throw new Error("Cannot retrieve user data");
  }

  const responseList = result.map(
    (user) => new RegistrationResponseModel(user.userId, user.userName),
  );

  return responseList;
};



export { retrieveAllUsers, registerNewUser };
