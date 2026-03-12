/**
 * @param Bhoj Gc
 * The following interface is the complete interface that represents the cart object with packaged and unpackaged products
 */
import { PackagedProduct } from './PackagedProduct';
import { UnPackagedProduct } from './UnPackagedProduct';

export interface Cart {
  cartId: string;
  userId: string;
  packagedProducts: PackagedProduct[];
  unpackagedProducts: UnPackagedProduct[];
  hst: number;
  totalAmount: number;
}
