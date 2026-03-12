/**
 * The following interface will be send a patch request to backend to
 * add the packaged product to initialized cart
 */

export interface AddPackagedProductRequest {
  cartId: string;
  itemId: string;
}
