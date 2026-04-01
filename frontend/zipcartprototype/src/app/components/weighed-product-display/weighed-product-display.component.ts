import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductInformation } from 'src/app/classes/Models/PackagedProductInformation';
import { IONIC_UI } from 'src/UIImports';

@Component({
  selector: 'app-weighed-product-display',
  templateUrl: './weighed-product-display.component.html',
  styleUrls: ['./weighed-product-display.component.scss'],
  imports: [IONIC_UI, CommonModule],
  standalone: true,
})
export class WeighedProductDisplayComponent implements OnInit {
  products: ProductInformation[] = [];
  constructor() {}

  ngOnInit() {}
}
