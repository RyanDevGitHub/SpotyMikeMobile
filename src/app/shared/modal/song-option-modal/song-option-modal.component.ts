import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@capacitor/app';
import {
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ISong } from 'src/app/core/interfaces/song';
import { ModalStateService } from 'src/app/core/services/modal-state.service';

import { AddToPlaylistComponent } from '../add-to-playlist/add-to-playlist.component';

@Component({
  selector: 'app-song-option',
  templateUrl: './song-option-modal.component.html',
  styleUrls: ['./song-option-modal.component.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonText, IonIcon, IonImg, IonGrid],
})
export class SongOptionModalComponent implements OnInit, OnDestroy {
  private modalCtrl = inject(ModalController);
  private modalStateService = inject(ModalStateService);
  @Input() song: ISong;
  private router = inject(Router);
  store = inject(Store<AppState>);
  public isModalOpen: boolean;
  private modalSubscription: Subscription;

  constructor() {
    this.modalSubscription = this.modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value),
    );
  }

  ngOnInit() {
    console.log(this.song);
  }

  async onClickAddPlaylist() {
    const modal = await this.modalCtrl.create({
      component: AddToPlaylistComponent,
      componentProps: {
        song: this.song,
      },
    });
    modal.present();
  }
  onClickRedirectToAlbum() {
    this.router.navigate(['/home/album', this.song.albumInfo?.id]);
  }

  onClickShare() {}

  onClickRedirectToArtist() {
    this.router.navigate(['/home/artist-page/' + this.song.artistId]);
  }

  cancel() {
    this.modalCtrl.dismiss();
    this.modalStateService.setModalOpen(false);
  }
  ngOnDestroy() {
    this.modalStateService.setModalOpen(false);
  }
}
