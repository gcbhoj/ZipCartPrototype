import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IONIC_UI } from 'src/UIImports';
import { CameraComponent } from 'src/app/components/camera/camera.component';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { Cartservices } from 'src/app/services/mockserver/cartservice/cartservices';
import { ToastServices } from 'src/app/services/toastService/toast-services';
import { v4 as uuidv4 } from 'uuid';
import { WeighedProductDisplayComponent } from 'src/app/components/weighed-product-display/weighed-product-display.component';

@Component({
  selector: 'app-fruits-and-veg',
  templateUrl: './fruits-and-veg.page.html',
  styleUrls: ['./fruits-and-veg.page.scss'],
  standalone: true,
  imports: [
    IONIC_UI,
    CommonModule,
    FormsModule,
    CameraComponent,
    WeighedProductDisplayComponent,
  ],
})
export class FruitsAndVegPage implements OnInit {
  imageUrlMock = '/assets/images/trialImages/image1.jpg';
  imageArray: string[] = [
    '../../../assets/images/trialImages/image1.jpg',
    '../../../assets/images/trialImages/image2.jpg',
    '../../../assets/images/trialImages/image3.jpg',
    '../../../assets/images/trialImages/image4.jpg',
  ];
  imageURL: string = '';

  constructor(
    private dataSharing: Datasharing,
    private cartService: Cartservices,
    private toast: ToastServices,
  ) {}

  ngOnInit() {
    this.receiveUnpackagedProductImage();
  }

  /**
   * DATA SHARING & RECEIVING
   */
  receiveUnpackagedProductImage() {
    this.dataSharing.imageSharing$.subscribe({
      next: async (data) => {
        if (data) {
          this.imageURL = data;

          try {
            // ✅ Convert URL → Blob
            const blob = await this.convertUrlToBlob(this.imageURL);

            // ✅ Generate ID
            const imageId = uuidv4();

            // ✅ Convert Blob → File
            const file = new File([blob], `${imageId}.jpg`, {
              type: blob.type || 'image/jpeg',
            });

            // ✅ Create FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('imageId', imageId);

            // ✅ Upload
            this.uploadImage(formData);
          } catch (error) {
            console.error('Error converting image:', error);
          }
        }
      },
    });
  }

  /**
   * SERVICE CALLS
   */
  uploadImage(formData: FormData) {
    this.cartService.getProductByImage(formData).subscribe({
      next: (res) => {
        this.toast.showSuccess(res);
      },
      error: (err) => {
        const message = err?.error?.message || 'Veg UnIdentified';
        this.toast.showError(message);
      },
    });
  }

  async convertUrlToBlob(imageUrl: string): Promise<Blob> {
    const response = await fetch(imageUrl);
    return await response.blob();
  }
  /**
   * SEND IMAGE BUTTON FUNCTIONS
   */

  async sendImageButton() {
    try {
      // ✅ Convert URL → Blob
      const blob = await this.convertUrlToBlob(this.imageUrlMock);

      // ✅ Generate ID
      const imageId = uuidv4();

      // ✅ Convert Blob → File
      const file = new File([blob], `${imageId}.jpg`, {
        type: blob.type || 'image/jpeg',
      });

      // ✅ Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('imageId', imageId);

      // ✅ Upload
      this.uploadImage(formData);
    } catch (error) {
      console.error('Error converting image:', error);
    }
  }
}
