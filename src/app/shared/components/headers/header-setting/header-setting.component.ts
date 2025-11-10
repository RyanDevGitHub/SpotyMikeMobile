import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonCol,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { BackButtonComponent } from '../../button/back-button/back-button.component';

@Component({
  selector: 'app-header-setting',
  templateUrl: './header-setting.component.html',
  styleUrls: ['./header-setting.component.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonToolbar,
    IonHeader,
    IonGrid,
    IonRow,
    IonCol,
    BackButtonComponent,
    IonText,
  ],
})
export class HeaderSettingComponent {
  @Input() title: string;
  @Input() saveData: boolean;

  @Output() saveEvent = new EventEmitter<boolean>(); // l’EventEmitter
  constructor() {}

  save() {
    if (this.saveData) {
      this.saveEvent.emit(this.saveData); // on envoie la data au parent
      console.log('[Child] Save data emitted:', this.saveData);
    }
  }
}
