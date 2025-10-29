import { Component, inject, OnInit } from '@angular/core';
import { AppState } from '@capacitor/app';
import {
  IonAvatar,
  IonText,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { filter, Observable, take } from 'rxjs';
import { IUser } from 'src/app/core/interfaces/user';
import { selectUser } from 'src/app/core/store/selector/user.selector';
import { AsyncPipe } from '@angular/common';

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
