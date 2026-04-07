import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDisplay } from 'src/app/classes/DTOs/UserDisplayDTO';
import { LoginResponse } from 'src/app/classes/DTOs/LoginResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // change to the below backend url while working with web
  private backendUrl: string = 'http://localhost:5000/mockserver/users/';
  // change to the below backend url while working with emulator
  private backendUrlEmulator: string = 'http://10.0.2.2:5000/mockserver/users/';
  // change to the below backend url while working with device where the 0.0.0.0 is the users IPV4 Address
  private backendUrlDevice: string = 'http://10.0.0.87:5000/mockserver/users/';

  private userSubject = new BehaviorSubject<UserDisplay[]>([]);
  user$ = this.userSubject.asObservable();
  constructor(private http: HttpClient) {}

  logInUser(userId: string) {
    return this.http.get<LoginResponse>(
      this.backendUrl + 'authenticate/' + userId,
    );
  }
}
