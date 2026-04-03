import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginResponse } from 'src/app/classes/DTOs/LoginResponseDTO';
import { Testservices } from 'src/app/services/mockserver/test/testservices';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { ToastServices } from 'src/app/services/toastService/toast-services';
import { IonicModule } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  logIn: LoginResponse = {
    userId: '11121314-1516-1718-1920-212223242526',
    userName: '',
    message: '',
  };
  constructor(
    private testService: Testservices,
    private dataSharing: Datasharing,
    private toast: ToastServices,
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.loginUser(this.logIn.userId);
    this.shareLogInResponse();
  }

  // temporary implementaion for login with hardcoded user Id
  loginUser(userId: string) {
    this.testService
      .logInUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: LoginResponse) => {
          this.logIn = result;
          this.toast.showSuccess(this.logIn.message);
        },
        error: (err) => {
          const message = err?.error?.message || 'Unable to login';
          this.toast.showError(message);
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
