import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AdduserComponent } from "src/app/components/test/adduser/adduser.component";
import { ViewalluserComponent } from "src/app/components/test/viewalluser/viewalluser.component";

@Component({
  selector: 'app-testpage',
  templateUrl: './testpage.page.html',
  styleUrls: ['./testpage.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, AdduserComponent, ViewalluserComponent]
})
export class TestpagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
