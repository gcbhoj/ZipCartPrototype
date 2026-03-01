import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/app/classes/LoginResponseDTO';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { Testservices } from 'src/app/services/mockserver/test/testservices';
import { Datasharing } from 'src/app/services/datasharing/datasharing';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle],
})
export class LoginComponent implements OnInit {
  logIn: LoginResponse = {
    userId: 'b0cc1cf8-bbf8-4e12-9c0a-c6513a50bb9a',
    userName: '',
    message: '',
  };
  constructor(
    private testService: Testservices,
    private dataSharing: Datasharing,
  ) {}

  ngOnInit() {
    this.loginUser(this.logIn.userId);
    this.shareUserId();
  }

  // temporary implementaion for login
  loginUser(userId: string) {
    this.testService.logInUser(userId).subscribe({
      next: (result: LoginResponse) => {
        this.logIn = result;
      },
      error: (err) => {
        console.error('Login failed:', err);
      },
    });
  }

  shareUserId() {
    const userId = this.logIn.userId;
    this.dataSharing.exchangeUserId(userId);
  }
}
