import fs from "fs";
import { readBarcodes } from "zxing-wasm/full"; // full module for Node.js

async function readBarcodeFromFile(filePath) {
  // Read the PNG file as a Uint8Array
  const fileBuffer = fs.readFileSync(filePath);

  // Call readBarcodes
  const result = await readBarcodes(fileBuffer);

  if (result && result.length > 0) {
    result.forEach((barcode, index) => {
      console.log(`Barcode ${index + 1}:`);
      console.log("  Text:", barcode.text);
      console.log("  Format:", barcode.format);
    });
  } else {
    console.log("No barcodes found in the image.");
  }
}

// Example usage
readBarcodeFromFile("receipt-barcode.png");
