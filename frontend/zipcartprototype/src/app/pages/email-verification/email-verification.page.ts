import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule] 
  
})
export class EmailVerificationPage {

  constructor(private router: Router) {}

  resendEmail() {
    console.log('resend email clicked'); // later connect backend
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}