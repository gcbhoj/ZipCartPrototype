import { readData } from "../utils/reader.js";
import path from "path";
import { fileURLToPath } from "url";

// Resolve path reliably
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/productinformation.json");

const products = new Map();

const getAllProductInformation = async () => {
  const result = await readData(filePath);

  products.clear();

  if (Array.isArray(result)) {
    result.forEach((product) => {
      products.set(product.upc, product);
    });
  }

  return result;
};

const getProductByUPC = async (barCodeValue) => {
  if (products.size === 0) {
    await getAllProductInformation();
  }

  const product = products.get(barCodeValue);

  return product;
};

const getProductByItemNumber = async (itemNumber) => {
  if (products.size == 0) {
    await getAllProductInformation();
  }
  for (const product of products.values()) {
    if (product.itemNumber === itemNumber) {
      return product;
    }
  }

  return null;
};

const getProductByName = async (productName) => {
  if (products.size == 0) {
    await getAllProductInformation();
  }

  for (const product of products.values()) {
    if (product.productName == productName) {
      return product;
    }
  }

  return null;
};

// const result = await getProductByName("banana");

// console.log(result);

export { getProductByUPC, getProductByItemNumber, getProductByName };
