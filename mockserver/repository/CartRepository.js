import PackagedProduct from "../models/PackagedProductModel.js";
import UnpackagedProduct from "../models/UnPackagedProductModel.js";
import Cart from "../models/CartModel.js";
import { readData } from "../utils/reader.js";

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

// const result = await getOpenCartsByUser("11121314-1516-1718-1920-212223242526");
// console.log(result);

export { addNewCart, getCartById, getOpenCartsByUser };
