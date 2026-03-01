import PackagedProduct from "../models/PackagedProductModel.js";
import UnpackagedProduct from "../models/UnPackagedProductModel.js";
import Cart from "../models/CartModel.js";
import { readData } from "../utils/reader.js";

const filePath = "./data/cart.json";

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
          p.totalPrice,
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
          u.totalPrice,
        ),
    );

    const cart = new Cart(
      c.cartId,
      c.storeName,
      c.userId,
      packagedProducts,
      unpackagedProducts,
      c.status,
      c.hst,
      c.totalAmount,
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

const getCartByUser = async (userId) => {
  // Make sure carts are loaded
  if (carts.size === 0) {
    await getAllCarts();
  }

  // Find the cart for this user
  const userCart = Array.from(carts.values()).find(
    (cart) => cart.userId === userId,
  );

  return userCart || null; // return null if no cart found
};

export { getCartByUser };
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
