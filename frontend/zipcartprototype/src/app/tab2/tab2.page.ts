/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */

import { Component, OnInit } from '@angular/core';
import { IONIC_UI } from 'src/UIImports';
import { Router } from '@angular/router';
import { CartComponent } from '../components/cart/cart.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IONIC_UI, CartComponent],
})
export class Tab2Page implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {}
}
