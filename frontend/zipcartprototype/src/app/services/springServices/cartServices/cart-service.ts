import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from 'src/app/classes/Models/Cart';
import { StartShopping } from 'src/app/classes/DTOs/StartShoppingDTO';
import { StartShoppingResponse } from 'src/app/classes/DTOs/StartShoppingResponse';
import { PackagedProductRequests } from 'src/app/classes/DTOs/PackagedProductRequests';
import { PackagedProductResponse } from 'src/app/classes/DTOs/PackagedProductResponse';
import { PythonResponse } from 'src/app/classes/DTOs/PythonResponse';
import { ProductInformation } from 'src/app/classes/Models/PackagedProductInformation';
import { WeighProductRequest } from 'src/app/classes/DTOs/WeighProductRequestDTO';
import { AddWeighedProduct } from 'src/app/classes/DTOs/AddWeighedProductDTO';
import { WeighProductResponse } from 'src/app/classes/DTOs/WeighProductResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // change to the below backend url while working with web
  private backendUrl: string = 'http://localhost:5000/mockserver/cart';
  // change to the below backend url while working with emulator
  private backendUrlEmulator: string = 'http://10.0.2.2:5000/mockserver/cart';
  // change to the below backend url while working with device where the 0.0.0.0 is the users IPV4 Address
  private backendUrlDevice: string = 'http://10.0.0.87:5000/mockserver/cart';

  private pythonURL: string = 'http://localhost:5001/api/py/predict_fruits_veg';

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$: Observable<Cart | null> = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  initializeCart(dto: StartShopping): Observable<StartShoppingResponse> {
    return this.http.post<StartShoppingResponse>(
      `${this.backendUrl}/initialize`,
      dto,
    );
  }

  addPackagedProductToCart(
    request: PackagedProductRequests,
  ): Observable<PackagedProductResponse> {
    return this.http.post<PackagedProductResponse>(
      `${this.backendUrl}/add-packaged`,
      request,
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

  increasePackagedProductQuantity(
    dto: PackagedProductRequests,
  ): Observable<PackagedProductResponse> {
    return this.http.post<PackagedProductResponse>(
      `${this.backendUrl}/increase-packaged`,
      dto,
    );
  }

  decreasePackagedProductQuantity(
    dto: PackagedProductRequests,
  ): Observable<PackagedProductResponse> {
    return this.http.post<PackagedProductResponse>(
      `${this.backendUrl}/decrease-packaged`,
      dto,
    );
  }

  removePackagedProduct(
    dto: PackagedProductRequests,
  ): Observable<PackagedProductResponse> {
    return this.http.patch<PackagedProductResponse>(
      `${this.backendUrl}/remove-packaged`,
      dto,
    );
  }

  getProductByImage(formData: FormData): Observable<PythonResponse> {
    return this.http.post<PythonResponse>(
      `${this.pythonURL}`, // adjust endpoint
      formData,
    );
  }

  getProductByName(productName: string): Observable<ProductInformation[]> {
    return this.http.get<ProductInformation[]>(
      `${this.backendUrl}/getByName/${productName}`,
    );
  }

  getProductLiveWeight(request: WeighProductRequest) {
    return this.http.post<WeighProductResponse>(
      `${this.backendUrl}/live-weight`,
      request,
    );
  }

  addWeighedProduct(
    request: AddWeighedProduct,
  ): Observable<PackagedProductResponse> {
    return this.http.post<PackagedProductResponse>(
      `${this.backendUrl}/add-weighed`,
      request,
    );
  }

  removeWeighedProduct(
    request: PackagedProductRequests,
  ): Observable<PackagedProductResponse> {
    return this.http.patch<PackagedProductResponse>(
      `${this.backendUrl}/remove-weighed`,
      request,
    );
  }

  completeShopping(cartId: string): Observable<Blob> {
    return this.http.get(`${this.backendUrl}/complete/${cartId}`, {
      responseType: 'blob',
    });
  }
}
