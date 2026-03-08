import { retrieveAllRetailers } from "../services/RetailerService.js";

const fetchAllRetailers = async (req, res) => {
  try {
    const retailers = await retrieveAllRetailers();

    if (!Array.isArray(retailers) || retailers.length === 0) {
      return res.status(404).json({ message: "No retailers found" });
    }

    // Return the array of retailers
    return res.status(200).json(retailers);
  } catch (error) {
    console.error("Error fetching retailers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { fetchAllRetailers };
