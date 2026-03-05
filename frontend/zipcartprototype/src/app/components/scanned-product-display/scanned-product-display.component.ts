import { Component, OnInit } from '@angular/core';
import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-scanned-product-display',
  templateUrl: './scanned-product-display.component.html',
  styleUrls: ['./scanned-product-display.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonAccordion,
    IonAccordionGroup,
  ],
})
export class ScannedProductDisplayComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
