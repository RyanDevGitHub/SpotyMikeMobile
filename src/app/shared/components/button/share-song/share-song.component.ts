import { Component, inject, Input } from '@angular/core';
import { IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { shareSocialOutline } from 'ionicons/icons';
import { ShareModalComponent } from 'src/app/shared/modal/share-modal/share-modal.component';

@Component({
  selector: 'app-share-song',
  templateUrl: './share-song.component.html',
  standalone: true,
  styleUrls: ['./share-song.component.scss'],
  imports: [IonButton, IonIcon],
})
export class ShareSongComponent {
  constructor() {
    addIcons({ shareSocialOutline });
  }
  @Input() id: string;
  modalCtl = inject(ModalController);

  async onClick() {
    console.log('click!');
    const modal = await this.modalCtl.create({
      component: ShareModalComponent,
      initialBreakpoint: 1, // Set the initial breakpoint to 30%
      breakpoints: [0, 1], // Allow dragging to full height or lower
      cssClass: 'custom-modal-filter',
    });
    modal.present();
  }
}
