import { writeBarcode } from "zxing-wasm/writer";
import fs from "fs";

/**
 * Generate CODE_128 barcode for a receipt item
 * @param {Object} item - { itemNumber, name, quantity, total }
 * @returns {Promise<Buffer>} - PNG buffer
 */
const generateReceiptBarcode = async (cart) => {
  const writerOptions = {
    format: "QR_CODE",
    scale: 6,
  };

  const result = await writeBarcode(cart, writerOptions);

  // Convert Blob → Buffer for Node.js
  const arrayBuffer = await result.image.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export { generateReceiptBarcode };

// // Example usage
// (async () => {
//   const receiptItem = {
//     itemNumber: "12345",
//     name: "Apple",
//     quantity: 3,
//     total: 4.5,
//   };

//   const buffer = await generateReceiptBarcode(receiptItem);
//   fs.writeFileSync("receipt-barcode.png", buffer);
//   console.log("Receipt barcode saved as receipt-barcode.png");
// })();
