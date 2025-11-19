import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AnimationController,
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  flashOutline,
  settingsOutline,
  timerOutline,
} from 'ionicons/icons';
import { AuthFacade } from 'src/app/core/state/auth/auth.facade';

@Component({
  selector: 'app-quick-menu',
  templateUrl: './quick-menu.component.html',
  standalone: true,
  styleUrls: ['./quick-menu.component.scss'],
  imports: [
    IonContent,
    IonButton,
    IonAvatar,
    IonText,
    IonGrid,
    IonCol,
    IonRow,
    IonIcon,
    AsyncPipe,
  ],
})
export class QuickMenuComponent implements OnInit {
  user$ = this.authFacade.user$;
  constructor(
    private animationCtrl: AnimationController,
    private authFacade: AuthFacade,
  ) {}
  private modalCtl = inject(ModalController);
  private router = inject(Router);

  ngOnInit() {
    addIcons({
      chevronBackOutline,
      flashOutline,
      timerOutline,
      settingsOutline,
    });
  }
  async cancel() {
    await this.modalCtl.dismiss();
  }

  cancelAndRedirect(redirect: string) {
    this.cancel();
    this.router.navigate([redirect]);
  }
}
