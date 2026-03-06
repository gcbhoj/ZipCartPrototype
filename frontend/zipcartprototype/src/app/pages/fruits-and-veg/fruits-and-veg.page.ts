import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-fruits-and-veg',
  templateUrl: './fruits-and-veg.page.html',
  styleUrls: ['./fruits-and-veg.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FruitsAndVegPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
