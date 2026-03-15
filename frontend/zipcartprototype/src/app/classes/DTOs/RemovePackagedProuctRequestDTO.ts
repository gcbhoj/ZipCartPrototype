/**
 * The following interface will be send a patch request to backend to
 * remove the packaged product to initialized cart
 */

export interface RemovePackagedProductRequest {
  cartId: string;
  itemId: string;
}
