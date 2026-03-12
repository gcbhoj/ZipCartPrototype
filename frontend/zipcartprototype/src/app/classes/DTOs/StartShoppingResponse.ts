import { Retailer } from 'src/app/classes/Models/Retailer';
export interface StartShoppingResponse {
  cartId: string;
  retailerName: string;
  budget: number;
  message: string;
}
