import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { MachineData } from 'src/app/classes/Models/MachineData';
import { AlertServices } from 'src/app/services/alertService/alert-services';

@Component({
  selector: 'app-weighing-machine-display',
  templateUrl: './weighing-machine-display.component.html',
  styleUrls: ['./weighing-machine-display.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class WeighingMachineDisplayComponent implements OnInit {
  machines: MachineData[] = [
    { machineId: '123456', machineLocation: 'east' },
    { machineId: 'abcd', machineLocation: 'west' },
  ];

  constructor(
    private modalCtrl: ModalController,
    private alert: AlertServices,
  ) {}

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(machineId: string) {
    this.alert.showAlert(
      'MACHINLE LOCATION PRESSED',
      'ADD PRODUCT TO THE MACHINE AND PRESS OK',
      ['OK'],
    );
    // return this.modalCtrl.dismiss(machineId, 'confirm');
  }
}
