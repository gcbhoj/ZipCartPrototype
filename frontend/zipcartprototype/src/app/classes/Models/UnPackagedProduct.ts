/**
 * @param Bhoj Gc
 * The following interface will be used to display the unpackaged items, that has
 * been added to the cart
 */
export interface UnPackagedProduct {
  productId: string;
  productName: string;
  itemNumber: string;
  imageUrl: string;
  weight: number;
  unitPrice: number;
}
