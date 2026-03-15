import PackagedProduct from "../models/PackagedProductModel.js";
import UnpackagedProduct from "../models/UnPackagedProductModel.js";
import Cart from "../models/CartModel.js";
import { readData } from "../utils/reader.js";
import fs from "node:fs/promises";

import path from "path";
import { fileURLToPath } from "url";
import { writeData } from "../utils/writer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/cart.json");

const carts = new Map();

const getAllCarts = async () => {
  const data = await readData(filePath);

  carts.clear();

  data.forEach((c) => {
    const packagedProducts = c.packagedProducts.map(
      (p) =>
        new PackagedProduct(
          p.productId,
          p.productName,
          p.itemNumber,
          p.imageUrl,
          p.quantity,
          p.unitPrice,
        ),
    );

    const unpackagedProducts = c.unpackagedProducts.map(
      (u) =>
        new UnpackagedProduct(
          u.productId,
          u.productName,
          u.itemNumber,
          u.imageUrl,
          u.weight,
          u.unitPrice,
        ),
    );

    const cart = new Cart(
      c.cartId,
      c.retailerId,
      c.userId,
      c.status,
      c.budget,
      packagedProducts,
      unpackagedProducts,
      c.transactionDateAndTime,
    );

    carts.set(cart.cartId, cart);
  });

  return Array.from(carts.values());
};

const getCartById = async (cartId) => {
  if (carts.size === 0) {
    await getAllCarts();
  }

  const result = carts.get(cartId);

  return result;
};

const addNewCart = async (cart) => {
  const response = await writeData(filePath, cart);

  if (response) {
    carts.set(cart.cartId, cart); // update in-memory cache
  }

  return response;
};

const getOpenCartsByUser = async (userId) => {
  if (carts.size === 0) {
    await getAllCarts();
  }

  for (const cart of carts.values()) {
    if (cart.userId === userId && cart.status === "open") {
      return cart;
    }
  }

  return null;
};

const addPackagedItemToCart = async (cartId, packagedProduct) => {
  if (carts.size === 0) {
    await getAllCarts();
  }

  const cart = carts.get(cartId);

  if (!cart) {
    throw new Error("CART NOT FOUND");
  }

  if (!cart.packagedProducts) {
    cart.packagedProducts = [];
    throw new Error("INVALID DATA");
  }

  cart.packagedProducts.push(packagedProduct);

  // overwrite file manually
  await fs.writeFile(
    filePath,
    JSON.stringify(Array.from(carts.values()), null, 2),
    "utf8",
  );

  return cart;
};

const setPackagedProductQty = async (cartId, itemNumber, quantity) => {
  if (carts.size === 0) {
    await getAllCarts();
  }

  const cart = carts.get(cartId);

  if (!cart) {
    throw new Error("CART NOT FOUND");
  }

  const product = cart.packagedProducts.find(
    (p) => p.itemNumber === itemNumber,
  );

  if (!product) {
    throw new Error("ITEM NOT FOUND");
  }

  // Replace quantity instead of increasing it
  product.quantity = quantity;

  await fs.writeFile(
    filePath,
    JSON.stringify(Array.from(carts.values()), null, 2),
    "utf8",
  );

  return product;
};
const removePackageItemFromCart = async (cartId, itemNumber) => {
  if (carts.size === 0) {
    await getAllCarts();
  }

  const cart = carts.get(cartId);

  if (!cart) {
    throw new Error("CART NOT FOUND");
  }

  const index = cart.packagedProducts.findIndex(
    (product) => product.itemNumber === itemNumber,
  );

  if (index === -1) {
    throw new Error("ITEM NOT FOUND");
  }

  const removedItem = cart.packagedProducts.splice(index, 1)[0];

  await fs.writeFile(
    filePath,
    JSON.stringify(Array.from(carts.values()), null, 2),
    "utf8",
  );

  return removedItem;
};

const addUnpackagedItemToCart = async (cartId, unpackagedProduct) => {
  if (carts.size == 0) {
    await getAllCarts();
  }

  const cart = carts.get(cartId);

  if (!cart) {
    throw new Error("CART NOT FOUND");
  }

  if (!cart.unpackagedProducts) {
    cart.unpackagedProducts = [];
    throw new Error("INVALID DATA");
  }

  cart.unpackagedProducts.push(unpackagedProduct);

  await fs.writeFile(
    filePath,
    JSON.stringify(Array.from(carts.values()), null, 2),
    "utf8",
  );

  return cart;
};

// const cartId = "b2c3d4e5-f6a7-4890-91bc-def123456789";
// const itemNumber = "411c3366-81ba-47ee-9932-0576f641c5e7";

// const response = await setPackagedProductQty(cartId, itemNumber, 5);
// console.log(response);

export {
  addNewCart,
  getCartById,
  getOpenCartsByUser,
  addPackagedItemToCart,
  addUnpackagedItemToCart,
  setPackagedProductQty,
  removePackageItemFromCart,
};
