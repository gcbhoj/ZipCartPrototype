import { AddPackagedProductResponse } from '../../../classes/DTOs/AddPackagedProductResponseDTO';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddPackagedProductRequest } from 'src/app/classes/DTOs/AddPackagedProductRequestDTO';
import { Cart } from 'src/app/classes/Models/Cart';
import { StartShopping } from 'src/app/classes/DTOs/StartShoppingDTO';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { UpdatePackagedProduct } from 'src/app/classes/DTOs/UpdatePackagedProductRequestDTO';
import { UpdatePackagedProductResponse } from 'src/app/classes/DTOs/UpdatePackagedProductResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class Cartservices {
  // change to the below backend url while working with web
  private backendUrl: string = 'http://localhost:3000/mockserver/cart';
  // change to the below backend url while working with emulator
  private backendUrlEmulator: string = 'http://10.0.2.2:3000/mockserver/cart';
  // change to the below backend url while working with device where the 0.0.0.0 is the users IPV4 Address
  private backendUrlDevice: string = 'http://99.217.41.87:3000/mockserver/cart';

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$: Observable<Cart | null> = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  initializeCart(dto: StartShopping): Observable<StartShoppingResponse> {
    return this.http.post<StartShoppingResponse>(
      `${this.backendUrl}/initialize`,
      dto,
    );
  }

  getCartByCartId(cartId: string): void {
    this.http.get<Cart>(`${this.backendUrl}/retrieve/${cartId}`).subscribe({
      next: (cart: Cart) => {
        this.cartSubject.next(cart);
      },
      error: (err) => console.error('Failed to load Cart Items', err),
    });
  }

  addPackagedProductToCart(
    request: AddPackagedProductRequest,
  ): Observable<AddPackagedProductResponse> {
    return this.http.patch<AddPackagedProductResponse>(
      `${this.backendUrl}/add-packaged`,
      request,
    );
  }

  updatePackagedProductQuantity(
    request: UpdatePackagedProduct,
  ): Observable<UpdatePackagedProductResponse> {
    return this.http.patch<UpdatePackagedProductResponse>(
      `${this.backendUrl}/update-qty`,
      request,
    );
  }
}
