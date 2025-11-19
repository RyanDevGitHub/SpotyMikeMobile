import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonCol,
  IonImg,
  IonRow,
  ModalController,
} from '@ionic/angular/standalone';
import { PlayContext } from 'src/app/core/interfaces/play-page-type';
import { ISong } from 'src/app/core/interfaces/song';
import { formatDuration } from 'src/app/core/services/utils/utils'; // 👈 import de ta fonction

import { ModalStateService } from '../../../../core/services/modal-state.service';
import { PlaySongPage } from '../../../modal/play-song/play-song.page';
import { LikeSongComponent } from '../../button/like-song/like-song.component';
import { ShareSongComponent } from '../../button/share-song/share-song.component';
import { SongOptionComponent } from '../../button/song-option/song-option.component';

@Component({
  selector: 'app-music-container',
  templateUrl: './music-container.component.html',
  styleUrls: ['./music-container.component.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonImg,
    SongOptionComponent,
    LikeSongComponent,
    ShareSongComponent,
    IonCol,
  ],
})
export class MusicContainerComponent implements OnInit {
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
  @Input() openWith: PlayContext;

  ngOnInit(): void {
    console.log(this.openWith);
    this.openWith.sourceId = this.song.id;
  }
  async openPlayer() {
    const modal = await this.modalCtrl.create({
      component: PlaySongPage,
      componentProps: {
        music: this.song,
        openWith: this.openWith,
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
