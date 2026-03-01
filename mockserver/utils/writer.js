import fs from "node:fs/promises";
import UserModel from "../models/UserModel.js";

const writeData = async (filePath, newData) => {
  try {
    // Read existing users
    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      existingData = JSON.parse(fileContent);
      if (!Array.isArray(existingData)) {
        existingData = [];
      }
    } catch (err) {
      // File doesn't exist or invalid JSON → start empty
      existingData = [];
    }

    // Add new item
    existingData.push(newData);

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), "utf8");

    console.log("Data written successfully!");
    return newData;
  } catch (error) {
    console.error("Error writing file:", error);
    throw error;
  }
};

export { writeData };
