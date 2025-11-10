import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AppState } from '@capacitor/app';
import {
  IonAvatar,
  IonCol,
  IonGrid,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/core/store/selector/user.selector';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.scss'],
  standalone: true,
  imports: [IonRow, IonGrid, IonAvatar, IonCol, IonText, AsyncPipe],
})
export class ProfileItemComponent {
  store = inject(Store<AppState>);
  user$ = this.store.select(selectUser);
  constructor() {}
}
