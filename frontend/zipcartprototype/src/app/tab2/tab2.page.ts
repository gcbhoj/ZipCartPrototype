import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartComponent } from '../components/cart/cart.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CartComponent],
})
export class Tab2Page implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {}
}
