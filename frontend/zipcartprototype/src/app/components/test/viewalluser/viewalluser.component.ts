import { CommonModule } from '@angular/common';
import { Testservices } from '../../../services/mockserver/test/testservices';
import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { UserDisplay } from 'src/app/classes/UserDisplayDTO';

@Component({
  selector: 'app-viewalluser',
  templateUrl: './viewalluser.component.html',
  styleUrls: ['./viewalluser.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonAvatar,
    IonHeader,
    IonToolbar,
    IonTitle,
  ],
})
export class ViewalluserComponent implements OnInit {
  users: UserDisplay[] = [];

  constructor(private testService: Testservices) {}

  ngOnInit() {
    this.testService.users$.subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users', err);
      },
    });

    this.testService.loadAllUsers();
  }
}
