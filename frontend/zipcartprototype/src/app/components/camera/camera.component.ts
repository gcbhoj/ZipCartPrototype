import { Component, OnInit } from '@angular/core';
import { IONIC_UI } from 'src/UIImports';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  standalone: true,
  imports: [IONIC_UI],
})
export class CameraComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  cameraClicked() {
    console.log('Camera has been clicked');
  }
}
