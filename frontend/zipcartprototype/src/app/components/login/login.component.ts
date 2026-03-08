/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/app/classes/LoginResponseDTO';
import { IONIC_UI } from 'src/UIImports';
import { Testservices } from 'src/app/services/mockserver/test/testservices';
import { Datasharing } from 'src/app/services/datasharing/datasharing';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IONIC_UI],
})
export class LoginComponent implements OnInit {
  logIn: LoginResponse = {
    userId: '11121314-1516-1718-1920-212223242526',
    userName: '',
    message: '',
  };
  constructor(
    private testService: Testservices,
    private dataSharing: Datasharing,
  ) {}

  ngOnInit() {
    this.loginUser(this.logIn.userId);
    this.shareLogInResponse();
  }

  // temporary implementaion for login with hardcoded user Id
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

  // sharing login response object
  shareLogInResponse() {
    if (this.logIn) {
      this.dataSharing.exchangeLoginResponse(this.logIn);
    }
  }
}
