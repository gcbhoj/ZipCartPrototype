/**
 * @param Bhoj Gc
 * The following interface will be used to display the packaged items, that has
 * been added to the cart
 */

export interface PackagedProduct {
  productId: string;
  productName: string;
  itemNumber: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}
//TODO:
