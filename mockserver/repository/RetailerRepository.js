import { readData } from "../utils/reader.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/retailer.json");

const retailers = new Map();

// Fetch all retailers from JSON file and populate the Map
const getAllRetailers = async () => {
  const data = await readData(filePath);

  if (!data || data.length === 0) {
    throw new Error("NO RETAILERS AVAILABLE");
  }

  retailers.clear(); // clear map before populating
  data.forEach((retailer) => {
    if (retailer.retailerId) {
      retailers.set(retailer.retailerId, retailer);
    }
  });

  return data; // return array of retailers
};

// Fetch a single retailer by ID
const getRetailerById = async (retailerId) => {
  // If the map is empty, populate it first
  if (retailers.size === 0) {
    await getAllRetailers();
  }

  const retailer = retailers.get(retailerId);

  if (!retailer) {
    throw new Error(`NO RETAILER AVAILABLE WITH ID: ${retailerId}`);
  }

  return retailer;
};

export { getAllRetailers, getRetailerById };
