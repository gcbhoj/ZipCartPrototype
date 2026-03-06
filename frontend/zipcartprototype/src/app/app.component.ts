import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, scan, cart, person } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({ home, scan, cart, person });
  }
}
