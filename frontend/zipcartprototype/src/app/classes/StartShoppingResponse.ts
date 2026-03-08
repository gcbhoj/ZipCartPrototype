import { Retailer } from 'src/app/classes/Retailer';
export interface StartShoppingResponse {
  cartId: string;
  retailerName: string;
  budget: number;
  message: string;
}
