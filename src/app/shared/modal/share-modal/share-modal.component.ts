import { Component, Input, OnInit } from '@angular/core';
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  standalone: true,
  styleUrls: ['./share-modal.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonModal,
    IonButton,
    IonCol,
    IonAvatar,
    IonRow,
    IonGrid,
  ],
})
export class ShareModalComponent {
  constructor() {}
  @Input() id: string;
}
