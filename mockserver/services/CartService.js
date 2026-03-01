import PackagedProduct from "../models/PackagedProductModel.js";
import UnpackagedProduct from "../models/UnPackagedProductModel.js";
import Cart from "../models/CartModel.js";
import CartDTO from "../models/CartDTO.js";
import { getCartByUser } from "../repository/CartRepository.js";

const getCartByUserId = async (userId) => {
  const cart = await getCartByUser(userId);

  if (!cart) {
    throw new Error("No cart found for user");
  }

  return new CartDTO(
    cart.cartId,
    cart.userId,
    cart.packagedProducts,
    cart.unpackagedProducts,
    cart.hst,
    cart.totalAmount,
  );
};

export { getCartByUserId };

// const result = await getCartByUserId("b0cc1cf8-bbf8-4e12-9c0a-c6513a50bb9a");

// console.log(result);
