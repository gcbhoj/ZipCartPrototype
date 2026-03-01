import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    LoginComponent,
  ],
})
export class Tab1Page {
  constructor(private router: Router) {}

  goToTestPage() {
    this.router.navigate(['/testpage']);
  }
}
