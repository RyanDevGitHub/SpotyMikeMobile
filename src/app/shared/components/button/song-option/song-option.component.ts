import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
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
  @Output() navigateRequest = new EventEmitter<{
    action: string;
    id: string;
  }>();
  private ctrlModal = inject(ModalController);

  async openModal() {
    const modalRef = await this.ctrlModal.create({
      component: SongOptionModalComponent,
      componentProps: {
        song: this.song, // Replace with actual cover image if available
      },
      initialBreakpoint: 1, // Set the initial breakpoint to 30%
      breakpoints: [0, 1], // Allow dragging to full height or lower
      cssClass: 'custom-modal-class',
    });
    this.modalStateService.setModalOpen(true);

    modalRef.present();
    const { data: song, role } = await modalRef.onDidDismiss();
    if (role === 'navigate-album' && song) {
      // 5. Transmet l'événement à PlaySongPage via l'Output !
      console.log("Redirection vers l'album avec ID :", song.albumId);
      this.navigateRequest.emit({
        action: 'REDIRECT_TO_ALBUM',
        id: song.albumId,
      });
      // La chaîne est complétée pour ce composant.
    }
    if (role === 'navigate-artist' && song) {
      console.log("Redirection vers l'artiste avec ID :", song.artistId);
      this.navigateRequest.emit({
        action: 'REDIRECT_TO_ARTIST',
        id: song.artistId,
      });
    }
  }
}
