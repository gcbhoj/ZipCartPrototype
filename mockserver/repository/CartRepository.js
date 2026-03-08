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

  return carts.get(cartId) || null;
};


const addNewCart = async (cart) => {
  const response = await writeData(filePath, cart);

  if (!response) {
    throw new Error("UNABLE TO INITIALIZE NEW SHOPPING CART");
  }

  return response;
};

// const cart = new Cart("xyz", "1111", "2222", "open", 500, [], [], new Date());

// const result = await addNewCart(cart);
// console.log(result);

export { addNewCart, getCartById };
// const result = await getCartByUser("1c78af65-695e-4048-835a-17d91331e147");
// console.log(result);

// const result = await getAllCarts();

// result.forEach((cart) => {
//   console.log("Cart:", cart.cartId);

//   console.log("Packaged Products:");
//   cart.packagedProducts.forEach((p) => {
//     console.log(p);
//   });

//   console.log("Unpackaged Products:");
//   cart.unpackagedProducts.forEach((u) => {
//     console.log(u);
//   });
// });

// const result = await getAllCarts();
// console.log(result);
