import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  ModalController,
  Platform,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  standalone: true,
  styleUrls: ['./back-button.component.scss'],
  imports: [IonButtons, IonBackButton],
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
