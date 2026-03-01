import UserModel from "../models/UserModel.js";
import { readData } from "../utils/reader.js";
import { writeData } from "../utils/writer.js";
import { updateData } from "../utils/updater.js";
import { deleteData } from "../utils/remover.js";

const filePath = "./data/users.json";

// cache (optional but useful)
const users = new Map();

const getAllUsers = async () => {
  const data = await readData(filePath);

  // clear and repopulate cache
  users.clear();

  data.forEach((u) => {
    const user = new UserModel(u.userId, u.userName, u.userEmailAddress);
    users.set(user.userId, user);
  });

  return Array.from(users.values());
};
const getUserById = async (userId) => {
  // if cache is empty, load users first
  if (users.size === 0) {
    await getAllUsers();
  }

  return users.get(userId) || null;
};

const getUserByEmail = async (userEmailAddress) => {
  if (users.size === 0) {
    await getAllUsers();
  }

  return (
    Array.from(users.values()).find(
      (u) => u.userEmailAddress === userEmailAddress,
    ) || null
  );
};

const addNewUser = async (UserModel) => {
  const result = await writeData(filePath, UserModel);

  return result;
};

const updateUser = async (updatedUser) => {
  const result = await updateData(filePath, updatedUser);

  return result;
};

const deleteUser = async (userId) => {
  const result = await deleteData(filePath, userId);

  return result;
};

export {
  getUserById,
  addNewUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getAllUsers,
};
