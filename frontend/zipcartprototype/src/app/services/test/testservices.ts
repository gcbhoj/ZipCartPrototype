import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { UserDisplay } from 'src/app/classes/UserDisplayDTO';
import { RegisterUser } from 'src/app/classes/RegisterUserDTO';

@Injectable({
  providedIn: 'root',
})
export class Testservices {
  private backendUrl: string = 'http://localhost:3000/mockServer/users/';

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
}
