import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CommonModule } from '@angular/common';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class CameraComponent implements OnInit {
  constructor(private dataSharing: Datasharing) {}

  ngOnInit() {}
  /**
   * DATA SHARING
   */
  // sharing image

  shareImage(imageUrl: string) {
    this.dataSharing.exchangeUnpackagedProductImage(imageUrl);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    var imageUrl = image.webPath!;

    this.shareImage(imageUrl);
  }
}
