import { RegisterUser } from './../../../classes/RegisterUserDTO';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonItem,
  IonInput,
  IonList,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
} from '@ionic/angular/standalone';
import { Testservices } from 'src/app/services/mockserver/test/testservices';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonInput,
    IonList,
    IonButton,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonLabel,
  ],
})
export class AdduserComponent implements OnInit {
  user: RegisterUser = {
    userName: '',
    userEmailAddress: '',
  };

  constructor(private testService: Testservices) {}

  ngOnInit() {}

  addNewUser = () => {
    if (!this.user.userName || !this.user.userEmailAddress) {
      alert('Please fill in all fields!');
      return;
    }

    this.testService.addNewUser(this.user).subscribe({
      next: (res) => {
        console.log('User added successfully:', res);
        alert('User registered successfully!');
        // reset form
        this.user = { userName: '', userEmailAddress: '' };
      },
      error: (err) => {
        console.error('Error adding user:', err);
        alert('Failed to register user!');
      },
    });
  };
}
