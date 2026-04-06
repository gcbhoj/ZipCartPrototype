import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true, 
  imports: [IonicModule, CommonModule] 
})
export class Tab3Page {

  user = {
    name: 'Hanna Mahmood Peracha',
    email: 'hannaperacha@gmail.com',
    phone: '+1(437)-430-7860',
    address: 'Mississauga, Ontario'
  };

  constructor() {}
}