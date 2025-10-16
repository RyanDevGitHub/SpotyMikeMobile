import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  IonAvatar,
  IonCol,
  IonContent,
  IonGrid,
  IonRow,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { IUser } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-profil-info',
  templateUrl: './profil-info.component.html',
  styleUrls: ['./profil-info.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    IonAvatar,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    AsyncPipe,
    JsonPipe,
  ],
})
export class ProfilInfoComponent {
  @Input() user$: IUser | null;
  constructor() {}
}
