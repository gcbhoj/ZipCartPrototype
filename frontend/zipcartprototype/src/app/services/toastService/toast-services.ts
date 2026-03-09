import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class ToastServices {
  constructor(private toast: ToastController) {}

  async showSuccess(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'top',
      icon: 'thumbs-up',
    });

    await toast.present();
  }

  async showError(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      color: 'danger',
      position: 'top',
      icon: 'thumbs-down',
    });

    await toast.present();
  }
}
