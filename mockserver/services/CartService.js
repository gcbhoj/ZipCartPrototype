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
    cart.retailerId,
    cart.budget,
    cart.userId,
    cart.packagedProducts,
    cart.unpackagedProducts,
  );
};

export { getCartByUserId };

// const result = await getCartByUserId("11121314-1516-1718-1920-212223242526");

// console.log(result);
