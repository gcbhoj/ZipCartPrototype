import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Retailer } from 'src/app/classes/Models/Retailer';

@Injectable({
  providedIn: 'root',
})
export class RetailerService {
  // change to the below backend url while working with web
  private backendUrl: string = 'http://localhost:8080/api/allRetailers';
  // change to the below backend url while working with emulator
  private backendUrlEmulator: string = 'http://10.0.2.2:8080/allRetailers';
  // change to the below backend url while working with device where the 0.0.0.0 is the users IPV4 Address
  private backendUrlDevice: string = 'http://10.0.0.87:8080/allRetailers';

  private retailerInfoSubject = new BehaviorSubject<Retailer[]>([]);
  retailer$: Observable<Retailer[]> = this.retailerInfoSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchAllRetailers() {
    this.http.get<Retailer[]>(`${this.backendUrl}`).subscribe({
      next: (retailers) => {
        this.retailerInfoSubject.next(retailers);
      },

      error: (err) => {
        console.error('Error fetching retailers', err);
      },
    });
  }
}
