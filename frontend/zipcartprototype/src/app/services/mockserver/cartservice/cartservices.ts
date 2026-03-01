import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from 'src/app/classes/Cart';

@Injectable({
  providedIn: 'root',
})
export class Cartservices {
  private backendUrl: string = 'http://localhost:3000/mockServer/cart/';
  private backendUrlEmulator: string = 'http://10.0.2.2:3000/mockServer/cart/';

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$: Observable<Cart | null> = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCartByUserId(userId: string): void {
    this.http.get<Cart>(`${this.backendUrl}retrieve/${userId}`).subscribe({
      next: (cart: Cart) => this.cartSubject.next(cart),
      error: (err) => console.error('Failed to load Cart Items', err),
    });
  }
}
