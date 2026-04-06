import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraComponent } from 'src/app/components/camera/camera.component';
import { Datasharing } from 'src/app/services/datasharing/datasharing';
import { ToastServices } from 'src/app/services/toastService/toast-services';
import { v4 as uuidv4 } from 'uuid';
import { WeighedProductDisplayComponent } from 'src/app/components/weighed-product-display/weighed-product-display.component';
import { PythonResponseComponent } from 'src/app/components/python-response/python-response.component';
import { IonicModule } from '@ionic/angular';
import { CartService } from 'src/app/services/springServices/cartServices/cart-service';

@Component({
  selector: 'app-fruits-and-veg',
  templateUrl: './fruits-and-veg.page.html',
  styleUrls: ['./fruits-and-veg.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CameraComponent,
    WeighedProductDisplayComponent,
    PythonResponseComponent,
  ],
})
export class FruitsAndVegPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isProcessing = false;
  imageUrlMock = '';
  imageArray = {
    image1: '/assets/images/trialImages/image1.jpg',
    image2: '/assets/images/trialImages/image2.jpg',
    image3: '/assets/images/trialImages/image3.jpg',
    image4: '/assets/images/trialImages/image4.jpg',
  };

  imageURL: string = '';

  constructor(
    private dataSharing: Datasharing,
    private cartService: CartService,
    private toast: ToastServices,
  ) {}
  ngOnDestroy(): void {
    // Signal teardown for any subscriptions that use takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.receiveUnpackagedProductImage();
  }

  /**
   * DATA SHARING & RECEIVING
   */
  receiveUnpackagedProductImage() {
    this.dataSharing.imageSharing$.pipe(takeUntil(this.destroy$)).subscribe({
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
    this.cartService
      .getProductByImage(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.dataSharing.exchangeMockImage(this.imageUrlMock);
            this.dataSharing.exchangePythonResponse(res);
            this.getProductByProductName(res.data.productName);
          }
          this.isProcessing = false;
        },
        error: (err) => {
          const message = err?.error?.message || 'Veg UnIdentified';
          this.toast.showError(message);
          this.isProcessing = false;
        },
      });
  }

  async convertUrlToBlob(imageUrl: string): Promise<Blob> {
    const response = await fetch(imageUrl);
    return await response.blob();
  }

  getProductByProductName(productName: string) {
    this.cartService
      .getProductByName(productName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.dataSharing.exchangeProductInformationArray(res);
        },
        error: (err) => {
          const message =
            err?.error?.message || 'Unable to retrieve product By Name';
          this.toast.showError(message);
        },
      });
  }
  /**
   * SEND IMAGE BUTTON FUNCTIONS
   */

  async sendImageButton() {
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;
    try {
      this.getRandomImage();
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
      this.isProcessing = false;
    }
  }

  // Call this method to pick a random image
  getRandomImage() {
    const keys = Object.keys(this.imageArray) as Array<
      keyof typeof this.imageArray
    >;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    this.imageUrlMock = this.imageArray[randomKey];
  }
}
