import { ModalStateService } from '../../../../core/services/modal-state.service';
import { SongOptionComponent } from '../../button/song-option/song-option.component';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonCol, ModalController, IonContent } from '@ionic/angular/standalone';
import { IonImg, IonRow } from '@ionic/angular/standalone';
import { PlaySongPage } from '../../../modal/play-song/play-song.page';
import { LikeSongComponent } from '../../button/like-song/like-song.component';
import { ShareSongComponent } from '../../button/share-song/share-song.component';
import { ISong } from 'src/app/core/interfaces/song';
import { formatDuration } from 'src/app/core/services/utils/utils'; // 👈 import de ta fonction

@Component({
  selector: 'app-music-container',
  templateUrl: './music-container.component.html',
  styleUrls: ['./music-container.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonRow,
    IonImg,
    SongOptionComponent,
    PlaySongPage,
    LikeSongComponent,
    ShareSongComponent,
    IonCol,
  ],
})
export class MusicContainerComponent {
  modalStateService = inject(ModalStateService);
  modalCtrl = inject(ModalController);
  constructor() {}
  // @Input() cover: string;
  // @Input() musicName: string;
  // @Input() duration: string;
  @Input() artistName: string;
  // @Input() id: string;
  // @Input() url: string;
  @Input() song: ISong;

  async openPlayer() {
    const modal = await this.modalCtrl.create({
      component: PlaySongPage,
      componentProps: {
        music: this.song,
      },
    });
    modal.present();
  }

  openModal() {
    this.modalStateService!.setModalOpen(true); // ✅ plus undefined
  }

  getFormattedDuration(): string {
    return formatDuration(this.song.duration);
  }
}
