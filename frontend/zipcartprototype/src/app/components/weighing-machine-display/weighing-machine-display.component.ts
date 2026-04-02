import { WeighProductResponse } from './../../classes/DTOs/WeighProductResponseDTO';
import { CommonModule } from '@angular/common';
import { Component, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { MachineData } from 'src/app/classes/Models/MachineData';
import { AlertServices } from 'src/app/services/alertService/alert-services';
import { MachineService } from 'src/app/services/mockserver/machineServices/machine-service';
import { Input } from '@angular/core';
import { WeighProductRequest } from 'src/app/classes/DTOs/WeighProductRequestDTO';
import { LiveWeightComponent } from '../live-weight/live-weight.component';

@Component({
  selector: 'app-weighing-machine-display',
  templateUrl: './weighing-machine-display.component.html',
  styleUrls: ['./weighing-machine-display.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class WeighingMachineDisplayComponent implements OnInit {
  @Input() itemId!: string;
  selectedMachine: string = '';
  machines: MachineData[] = [];
  request: WeighProductRequest = {
    itemId: '',
    machineId: '',
  };

  constructor(
    private modalCtrl: ModalController,
    private alert: AlertServices,
    private machineService: MachineService,
  ) {}

  ngOnInit() {
    this.getAllMachines();
    console.log('Received Item Id', this.itemId);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm(machineId: string) {
    this.selectedMachine = machineId;
    this.prepareToGetLiveWeight();
    console.log(this.request);
    this.alert.showAlert(
      'NEED API CALL FOR LIVE WEIGHT',
      'OPEN A NEW MODAL WITH RESPONSE',
      ['OK'],
    );
    await this.openModal();
    return this.modalCtrl.dismiss(machineId, 'confirm');
  }

  /**
   * API CALLS
   */

  getAllMachines() {
    // Step 1: trigger API call
    this.machineService.fetchAllActiveMachines();

    // Step 2: subscribe to the observable
    this.machineService.machineDataSubject$.subscribe({
      next: (data) => {
        if (data) {
          this.machines = data;
        }
      },
    });
  }

  /**
   * DATA PREPRATION FOR API CALLS
   */

  prepareToGetLiveWeight() {
    this.request = {
      itemId: this.itemId,
      machineId: this.selectedMachine,
    };
  }

  /**
   * OPENING THE LIVE WEIGHT MODAL
   */

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: LiveWeightComponent,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('ITEM ADDED TO CART SUCCESSFULLY');
    }
  }
}
