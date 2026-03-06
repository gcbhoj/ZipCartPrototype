const retrieveProductDetails = async (req, res) => {
  try {
    const product = {
      productName: "Hello World",
    };

    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({
      message: "Failed to retrieve product",
    });
  }
};

export { retrieveProductDetails };
