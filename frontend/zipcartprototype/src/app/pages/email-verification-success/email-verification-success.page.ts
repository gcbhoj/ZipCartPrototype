import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-verification-success',
  templateUrl: './email-verification-success.page.html',
  styleUrls: ['./email-verification-success.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule] 
})
export class EmailVerificationSuccessPage {

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}


