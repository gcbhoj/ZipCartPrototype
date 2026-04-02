import { Retailer } from '../../../classes/Models/Retailer';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RetailerServices {
  // change to the below backend url while working with web
  private backendUrl: string = 'http://localhost:3000/mockserver';
  // change to the below backend url while working with emulator
  private backendUrlEmulator: string = 'http://10.0.2.2:3000/mockserver';
  // change to the below backend url while working with device where the 0.0.0.0 is the users IPV4 Address
  private backendUrlDevice: string = 'http://10.0.0.87:3000/mockserver';
  constructor(private http: HttpClient) {}
  private retailerInfoSubject = new BehaviorSubject<Retailer[]>([]);
  retailer$: Observable<Retailer[]> = this.retailerInfoSubject.asObservable();

  fetchAllRetailers() {
    this.http.get<Retailer[]>(`${this.backendUrl}/retailers/`).subscribe({
      next: (retailers) => {
        this.retailerInfoSubject.next(retailers);
      },

      error: (err) => {
        console.error('Error fetching retailers', err);
      },
    });
  }
}
