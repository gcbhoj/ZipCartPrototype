import { WeighProductResponse } from './../../classes/DTOs/WeighProductResponseDTO';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { MachineData } from 'src/app/classes/Models/MachineData';
import { AlertServices } from 'src/app/services/alertService/alert-services';
import { MachineService } from 'src/app/services/mockserver/machineServices/machine-service';
import { WeighProductRequest } from 'src/app/classes/DTOs/WeighProductRequestDTO';
import { LiveWeightComponent } from '../live-weight/live-weight.component';
import { Cartservices } from 'src/app/services/mockserver/cartservice/cartservices';
import { ToastServices } from 'src/app/services/toastService/toast-services';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { AddWeighedProduct } from 'src/app/classes/DTOs/AddWeighedProductDTO';

@Component({
  selector: 'app-weighing-machine-display',
  templateUrl: './weighing-machine-display.component.html',
  styleUrls: ['./weighing-machine-display.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class WeighingMachineDisplayComponent implements OnInit, OnDestroy {
  @Input() itemId!: string;

  selectedMachine: string = '';
  machines: MachineData[] = [];

  request: WeighProductRequest = {
    itemId: '',
    machineId: '',
  };

  productRequest!: AddWeighedProduct;

  liveWeight?: WeighProductResponse;

  private destroy$ = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private alert: AlertServices,
    private machineService: MachineService,
    private cartService: Cartservices,
    private toast: ToastServices,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getAllMachines();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * API CALLS
   */
  getAllMachines() {
    this.machineService.fetchAllActiveMachines();

    this.machineService.machineDataSubject$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.machines = data;
          }
        },
      });
  }

  /**
   * ✅ FIX: Wait for response THEN open modal
   */
  getProductLiveWeightAndOpenModal() {
    this.cartService
      .getProductLiveWeight(this.request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (data) => {
          if (data) {
            this.liveWeight = data;

            await this.openModal(); // open second modal
          }
        },
        error: (err) => {
          const message =
            err?.error?.message || 'Unable to fetch product live weight';
          this.toast.showError(message);
        },
      });
  }

  addWeighedProduct(request: AddWeighedProduct) {
    this.cartService
      .addWeighedProduct(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toast.showSuccess(response.result);
          this.cartService.getCartByCartId(this.productRequest.cartId);
        },
        error: (err) => {
          const message =
            err?.error?.message || 'Unable to add product to cart';
          this.toast.showError(message);
        },
      });
  }

  /**
   * DATA PREPARATION
   */
  prepareToGetLiveWeight() {
    this.request = {
      itemId: this.itemId,
      machineId: this.selectedMachine,
    };
  }

  /**
   * MODAL
   */
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: LiveWeightComponent,
      componentProps: { liveCart: this.liveWeight },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.productRequest = data;
      console.log('Live Data', this.productRequest);
      this.addWeighedProduct(this.productRequest);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm(machineId: string) {
    this.selectedMachine = machineId;
    this.prepareToGetLiveWeight();

    this.alert.showPreWeighConfirmationAlert(
      async () => {
        this.getProductLiveWeightAndOpenModal();
      },
      () => {
        this.modalCtrl.dismiss(null, 'cancel');
      },
    );
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
