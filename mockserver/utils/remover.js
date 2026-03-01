import fs from "node:fs/promises";
import UserModel from "../models/UserModel.js";

const filePath = "./data/users.json";

const deleteData = async (filePath, documentId) => {
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

    // Find user to delete
    const index = existingData.findIndex((u) => u.userId === documentId);

    if (index === -1) {
      console.log("User not found");
      return null;
    }

    // Remove user
    const deletedUser = existingData.splice(index, 1)[0];

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), "utf8");

    console.log("User deleted successfully!");
    return deletedUser;
  } catch (error) {
    console.error("Error deleting file:", error);
    return null;
  }
};

export { deleteData };
