import { IAlbum } from './../../../core/interfaces/album';
import { Store } from '@ngrx/store';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import { ISong } from 'src/app/core/interfaces/song';
import { ModalStateService } from 'src/app/core/services/modal-state.service';
import { AppState } from '@capacitor/app';
import { selectAlbumBySong } from 'src/app/core/store/selector/album.selector';
import { Observable } from 'rxjs';
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

  constructor() {}

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
