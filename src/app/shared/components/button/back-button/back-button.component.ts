import { LoginPage } from '../../../../pages/login/login.page';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  IonNav,
  IonBackButton,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonIcon,
  ModalController,
  IonModal,
  IonButton,
} from '@ionic/angular/standalone';
import { chevronBackOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Platform } from '@ionic/angular/standalone';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  standalone: true,
  styleUrls: ['./back-button.component.scss'],
  imports: [
    IonModal,
    IonIcon,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonBackButton,
    IonNav,
    LoginPage,
    IonButton,
  ],
})
export class BackButtonComponent implements OnInit {
  @Input() color: string;
  @Input() closeModal: boolean = false;
  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private _location: Location,
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });
  }
  ngOnInit() {
    addIcons({ chevronBackOutline });
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  backClicked() {
    this._location.back();
  }
}
