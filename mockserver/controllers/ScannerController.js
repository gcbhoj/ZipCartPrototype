import BarCodeRequest from "../models/BarcodeRequestDTO.js";
import { retrieveProductByUPC } from "../services/ProductServices.js";

const retrieveProductDetails = async (req, res) => {
  try {
    const { isValid, text, format, contentType } = req.body;

    const barCodeRequest = new BarCodeRequest(
      isValid,
      text,
      format,
      contentType,
    );

    const product = await retrieveProductByUPC(barCodeRequest);

    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({
      message: "Failed to retrieve product",
    });
  }
};

export { retrieveProductDetails };
