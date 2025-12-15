import { Component, inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonIcon,
  IonModal,
  ModalController,
} from '@ionic/angular/standalone';
import { ISong } from 'src/app/core/interfaces/song';
import { ModalStateService } from 'src/app/core/services/modal-state.service';

import { SongOptionModalComponent } from '../../../modal/song-option-modal/song-option-modal.component';

@Component({
  selector: 'app-song-option',
  templateUrl: './song-option.component.html',
  standalone: true,
  styleUrls: ['./song-option.component.scss'],
  imports: [IonButton, IonIcon],
})
export class SongOptionComponent {
  constructor(
    private modalStateService: ModalStateService,
    private router: Router
  ) {}
  @ViewChild(IonModal) modalRef!: IonModal;
  @Input() id: string;
  @Input() song: ISong;

  private ctrlModal = inject(ModalController);

  async openModal() {
    const modalRef = await this.ctrlModal.create({
      component: SongOptionModalComponent,
      componentProps: {
        song: this.song,
      },
      initialBreakpoint: 1,
      breakpoints: [0, 1],
      cssClass: 'custom-modal-class',
    });

    // 1. Ouvrir la modale et mettre à jour l'état du service
    this.modalStateService.setModalOpen(true);

    // 2. Écouter la fermeture de la modale, peu importe comment elle est fermée.
    // L'événement onDidDismiss est émis après la fin de l'animation de fermeture.
    modalRef.onDidDismiss().then(() => {
      // 3. Mettre à jour l'état du service pour retirer la classe 'modal-open'
      this.modalStateService.setModalOpen(false);
    });

    modalRef.present();
  }
}
