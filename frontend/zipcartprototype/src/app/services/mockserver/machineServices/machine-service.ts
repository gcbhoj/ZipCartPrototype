import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MachineData } from 'src/app/classes/Models/MachineData';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  // change to the below backend url while working with web
  private backendUrl: string = 'http://localhost:3000/mockserver/machines';
  // change to the below backend url while working with emulator
  private backendUrlEmulator: string =
    'http://10.0.2.2:3000/mockserver/machines';
  // change to the below backend url while working with device where the 0.0.0.0 is the users IPV4 Address
  private backendUrlDevice: string =
    'http://10.0.0.87:3000/mockserver/machines';

  constructor(private http: HttpClient) {}

  private machineDataSubject = new BehaviorSubject<MachineData[]>([]);
  machineDataSubject$: Observable<MachineData[]> =
    this.machineDataSubject.asObservable();

  fetchAllActiveMachines() {
    this.http.get<MachineData[]>(`${this.backendUrl}/`).subscribe({
      next: (data) => {
        this.machineDataSubject.next(data);
      },
    });
  }
}
