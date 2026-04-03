import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertServices {
  constructor(private alertController: AlertController) {}

  async showBudgetConfirmation(onOk: () => void, onCancel: () => void) {
    const alert = await this.alertController.create({
      header: 'Budget Setup',
      message: 'Would you like to set up a budget for this transaction?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => onCancel(),
        },
        {
          text: 'OK',
          handler: () => onOk(),
        },
      ],
    });

    await alert.present();
  }
  async showBudgetInput(onSubmit: (budget: number) => void) {
    const alert = await this.alertController.create({
      header: 'Enter Budget',
      inputs: [
        {
          name: 'budget',
          type: 'number',
          value: 0,
          placeholder: 'Enter your budget',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (data) => {
            onSubmit(data.budget);
          },
        },
      ],
    });

    await alert.present();
  }

  async showPreWeighConfirmationAlert(onOk: () => void, onCancel: () => void) {
    const alert = await this.alertController.create({
      header: 'Pre weight confirmation',
      message: 'Please add the product to the selected machine and press OK',
      buttons: [
        {
          text: 'OK',
          handler: () => onOk(),
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => onCancel(),
        },
      ],
    });

    await alert.present();
  }

  async showAlert(header: string, message: string, buttons: string[] = ['OK']) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons,
    });
    await alert.present();
  }
}
