import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonImg,
  IonRouterOutlet,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonGrid,
    IonImg,
    IonRouterOutlet,
    IonContent,
    FormsModule,
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
})
export class AuthPage {
  error = '';
}
