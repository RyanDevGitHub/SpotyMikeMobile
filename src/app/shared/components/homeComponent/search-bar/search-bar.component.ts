import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AnimationController,
  IonButton,
  IonButtons,
  IonIcon,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flashOutline, searchOutline } from 'ionicons/icons';

import { QuickMenuComponent } from '../../../modal/quick-menu/quick-menu.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  standalone: true,
  styleUrls: ['./search-bar.component.scss'],
  imports: [IonButtons, IonToolbar, IonButton, IonIcon],
})
export class SearchBarComponent {
  constructor(private animationCtrl: AnimationController) {
    addIcons({ flashOutline, searchOutline });
  }

  private modalCtl = inject(ModalController);
  private router = inject(Router);

  async openQuickMenu() {
    const modal = await this.modalCtl.create({
      component: QuickMenuComponent,
      enterAnimation: this.MyEnterAnimation,
      leaveAnimation: this.MyLeaveAnimation,
    });
    modal.present();
  }

  MyEnterAnimation = (baseEl: HTMLElement) => {
    const root: ShadowRoot | null = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('.modal-wrapper')!)
      .fromTo('transform', 'translateX(-100%)', 'translateX(0)')
      .fromTo('opacity', 0, 1);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  MyLeaveAnimation = (baseEl: HTMLElement) => {
    return this.MyEnterAnimation(baseEl).direction('reverse');
  };

  redirectToSearchPage() {
    this.router.navigate(['/home/search']);
  }
}
