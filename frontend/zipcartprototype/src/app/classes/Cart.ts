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
