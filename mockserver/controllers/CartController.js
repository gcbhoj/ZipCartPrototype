import { getCartByUserId } from "../services/CartService.js";

const retrieveCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const result = await getCartByUserId(userId);
    console.log(result);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No cart found for this user" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving cart:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve cart for user",
      error: error.message,
    });
  }
};

export { retrieveCartByUser };
