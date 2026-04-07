import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { UserDisplay } from 'src/app/classes/DTOs/UserDisplayDTO';
import { RegisterUser } from 'src/app/classes/DTOs/RegisterUserDTO';
import { LoginResponse } from 'src/app/classes/DTOs/LoginResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class Testservices {
  // change to the below backend url while working with web
  private backendUrl: string = 'http://localhost:3000/mockserver/users/';
  // change to the below backend url while working with emulator
  private backendUrlEmulator: string = 'http://10.0.2.2:3000/mockserver/users/';
  // change to the below backend url while working with device where the 0.0.0.0 is the users IPV4 Address
  private backendUrlDevice: string = 'http://10.0.0.87:3000/mockserver/users/';

  // ✅ BehaviorSubject to hold user list
  private usersSubject = new BehaviorSubject<UserDisplay[]>([]);
  users$ = this.usersSubject.asObservable(); // expose as observable

  constructor(private http: HttpClient) {}

  // ✅ Load users from backend and update BehaviorSubject
  loadAllUsers(): void {
    this.http.get<UserDisplay[]>(this.backendUrl + 'get_all_users').subscribe({
      next: (users) => this.usersSubject.next(users),
      error: (err) => console.error('Failed to load users', err),
    });
  }

  // ✅ Add new user and refresh list automatically
  addNewUser(user: RegisterUser): Observable<any> {
    return this.http.post<any>(this.backendUrl + 'register', user).pipe(
      tap(() => {
        this.loadAllUsers(); // refresh users after add
      }),
    );
  }

  logInUser(userId: string) {
    return this.http.get<LoginResponse>(
      this.backendUrl + 'authenticate/' + userId,
    );
  }
}
