/**
 * The following interface will be used to send a patch request to update item
 * quantity as per user interactions with +/- keys in the packageditem component
 */
export interface UpdatePackagedProduct {
  cartId: string;
  itemId: string;
  quantity: number;
}
