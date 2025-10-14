import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@capacitor/app';
import { IonButton } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/core/store/action/user.action';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss'],
  standalone: true,
  imports: [IonButton],
})
export class LogOutComponent {
  store = inject(Store<AppState>);
  constructor() {}
  
  logOut() {
    this.store.dispatch(logout());
  }
}
