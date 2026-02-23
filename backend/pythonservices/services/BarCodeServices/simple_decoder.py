import cv2
from pyzbar.pyzbar import decode





# The following function takes the image as image path as argument and then 
# cleans the image and reads barcode and returns barcode value

def simple_decoder(image_path):
    # Read the image
    img = cv2.imread(image_path)
    if img is None:
        return "Image not found!"

    # Decode barcodes in the image
    barcodes = decode(img)

    if barcodes:
        results = []
        for i, barcode in enumerate(barcodes):
            x, y, w, h = barcode.rect
            # Draw rectangle around each barcode
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            # Get the barcode data
            barcodeData = barcode.data.decode('utf-8')
            print(f"Barcode {i} data:", barcodeData)
            results.append(barcodeData)

        # # Save image with rectangles (optional)
        # cv2.imwrite("barcode_detected.png", img)
        return {"barcodes":results}
    else:
        return {"message":"Need more work to be done with this decoder"}


