import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-password-lost',
  templateUrl: './password-lost.component.html',
  styleUrls: ['./password-lost.component.scss'],
  imports: [
    IonItem,
    IonInput,
    IonContent,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
  ],
})
export class PasswordLostComponent {
  private modalCtl = inject(ModalController);
  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
    ]),
  });

  constructor() {}
  async cancel() {
    await this.modalCtl.dismiss();
  }
}
