/**
 * NOTE: TO IMPORT A NEW UI COMPONENT REGISTER THE COMPONENT IN UIImports.ts FILE
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IONIC_UI } from 'src/UIImports';
import { CameraComponent } from "src/app/components/camera/camera.component";

@Component({
  selector: 'app-fruits-and-veg',
  templateUrl: './fruits-and-veg.page.html',
  styleUrls: ['./fruits-and-veg.page.scss'],
  standalone: true,
  imports: [IONIC_UI, CommonModule, FormsModule, CameraComponent],
})
export class FruitsAndVegPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
