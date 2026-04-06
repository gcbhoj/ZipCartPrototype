import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginPage {

  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    console.log('login clicked');

   
    this.router.navigate(['/tabs/tab1']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}