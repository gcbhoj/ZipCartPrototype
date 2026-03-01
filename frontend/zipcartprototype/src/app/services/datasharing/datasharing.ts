import { PackagedProduct } from './../../classes/PackagedProduct';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnPackagedProduct } from 'src/app/classes/UnPackagedProduct';

@Injectable({
  providedIn: 'root',
})

/***
 * Creating a data sharing service to share data between components and pages
 */
export class Datasharing {
  private userIdSharing = new BehaviorSubject<string | null>(null);
  currentUserId: Observable<string | null> = this.userIdSharing.asObservable();

  private cartIdSharing = new BehaviorSubject<string | null>(null);
  currentCartId: Observable<string | null> = this.cartIdSharing.asObservable();

  private packagedProductSharing = new BehaviorSubject<PackagedProduct[]>([]);
  packagedProduct: Observable<PackagedProduct[]> =
    this.packagedProductSharing.asObservable();

  private unPackagedProductSharing = new BehaviorSubject<UnPackagedProduct[]>(
    [],
  );
  unPackagedProduct: Observable<UnPackagedProduct[]> =
    this.unPackagedProductSharing.asObservable();

  constructor() {}
  // exchanging userId between components
  exchangeUserId(userId: string) {
    this.userIdSharing.next(userId);
  }
  // exchanging cartId between components
  exchangeCartId(cartId: string) {
    this.cartIdSharing.next(cartId);
  }

  // exchanging packaged Product
  exchangePackagedProduct(products: PackagedProduct[]) {
    this.packagedProductSharing.next(products);
  }

  //exchanging unpackaged product
  exchangeUnPackagedProduct(products: UnPackagedProduct[]) {
    this.unPackagedProductSharing.next(products);
  }
}
