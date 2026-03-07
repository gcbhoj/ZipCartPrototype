/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component } from '@angular/core';
import { IONIC_UI } from 'src/UIImports';
import { Router } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IONIC_UI, LoginComponent],
})
export class Tab1Page {
  constructor(private router: Router) {}

  goToTestPage() {
    this.router.navigate(['/testpage']);
  }

  startShopping() {
    this.router.navigate(['/scanitems']);
  }
}
