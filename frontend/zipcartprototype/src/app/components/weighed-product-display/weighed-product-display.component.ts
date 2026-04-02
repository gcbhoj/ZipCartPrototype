import { WeighingMachineDisplayComponent } from './../weighing-machine-display/weighing-machine-display.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule, IonModal, ModalController } from '@ionic/angular';
import { ProductInformation } from 'src/app/classes/Models/PackagedProductInformation';
import { AlertServices } from 'src/app/services/alertService/alert-services';
import { Datasharing } from 'src/app/services/datasharing/datasharing';

@Component({
  selector: 'app-weighed-product-display',
  templateUrl: './weighed-product-display.component.html',
  styleUrls: ['./weighed-product-display.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true,
})
export class WeighedProductDisplayComponent implements OnInit {
  isMachineWindowOpen = false;
  products: ProductInformation[] = [];
  selectedMachine: string = '';

  constructor(
    private dataSharing: Datasharing,
    private alert: AlertServices,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.receiveProductInformation();
  }
  /**
   * MODAL
   */

  /**
   * DATA SHARING
   */
  receiveProductInformation() {
    this.dataSharing.shareProductInformationArray$.subscribe((data) => {
      if (data) {
        this.products = data;
      }
    });
  }
  /**
   * BUTTON FUNCTIONALITIES
   */
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: WeighingMachineDisplayComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.selectedMachine = data;
      console.log(this.selectedMachine);
    }
  }
}
