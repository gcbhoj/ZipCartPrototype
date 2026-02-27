import fs from "node:fs/promises";
import UserModel from "./UserModel.js";

const filePath = "./data/users.json";

const updateData = async (filePath, updatedUser) => {
  try {
    let existingData = [];

    // Read file
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      existingData = JSON.parse(fileContent);

      if (!Array.isArray(existingData)) {
        existingData = [];
      }
    } catch (err) {
      console.error("File not found or invalid JSON");
      return null;
    }

    // Find index of user to update
    const index = existingData.findIndex(
      (u) => u.userId === updatedUser.userId,
    );

    if (index === -1) {
      console.log("Document with given id not found");
      return null;
    }

    // Update user
    existingData[index] = updatedUser;

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), "utf8");

    console.log("User updated successfully!");
    return updatedUser;
  } catch (error) {
    console.error("Error updating file:", error);
    return null;
  }
};

// const updatedUser = new UserModel(
//   "5678",
//   "new User",
//   "newuser@getMaxListeners.com",
// );

// const result = await updateData(filePath, updatedUser);

// console.log(result);

export { updateData };
