import { Component, inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonCol, IonGrid, IonImg, IonRow } from '@ionic/angular/standalone';
import {
  PlayContext,
  PlayPageType,
} from 'src/app/core/interfaces/play-page-type';
import { ISong } from 'src/app/core/interfaces/song';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { formatDuration } from 'src/app/core/services/utils/utils';
import { PlaySongPage } from 'src/app/shared/modal/play-song/play-song.page';

@Component({
  selector: 'app-music-container-vertical',
  templateUrl: './music-container-vertical.component.html',
  styleUrls: ['./music-container-vertical.component.scss'],
  standalone: true,
  imports: [IonGrid, IonCol, IonRow, IonImg],
})
export class MusicContainerVerticalComponent implements OnInit {
  @Input() song: ISong;
  @Input() pageType: PlayPageType;
  private playContext: PlayContext;
  modalStateService = inject(ModalStateService);
  modalCtrl = inject(ModalController);

  ngOnInit(): void {
    this.playContext = { type: this.pageType };
  }
  async openPlayer() {
    const modal = await this.modalCtrl.create({
      component: PlaySongPage,
      componentProps: {
        music: this.song,
        openWith: this.playContext,
      },
    });
    modal.present();
  }

  openModal() {
    this.modalStateService.setModalOpen(true);
  }
  getFormattedDuration(): string {
    return formatDuration(this.song.duration);
  }
}
