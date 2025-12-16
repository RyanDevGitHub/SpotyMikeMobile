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
import { ShareModalComponent } from '../share-modal/share-modal.component';

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
  modalCtl = inject(ModalController);

  constructor() {
    this.modalSubscription = this.modalStateService.modalOpen$.subscribe(
      (value) => (this.isModalOpen = value)
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
    const albumId = this.song.albumInfo?.id;

    const dataToPassBack = {
      action: 'REDIRECT_TO_ALBUM',
      albumId: albumId,
    };

    // Fermer cette petite modale d'option, et envoyer l'intention.
    // Utiliser un rôle spécifique, par exemple 'navigate-album', pour le distinguer d'une simple fermeture.
    console.log("Redirection vers l'album avec ID :", albumId);
    this.modalCtrl.dismiss(dataToPassBack, 'navigate-album');
    // this.router.navigate(['/home/album', albumId]);
  }

  async onClickShare() {
    const modal = await this.modalCtl.create({
      component: ShareModalComponent,
      initialBreakpoint: 1, // Set the initial breakpoint to 30%
      breakpoints: [0, 1], // Allow dragging to full height or lower
      cssClass: 'custom-modal-filter',
    });
    modal.present();
  }

  onClickRedirectToArtist() {
    const artistId = this.song.artistId;

    const dataToPassBack = {
      action: 'REDIRECT_TO_ARTIST',
      artistId: artistId,
    };

    // Fermer cette petite modale d'option, et envoyer l'intention.
    // Utiliser un rôle spécifique, par exemple 'navigate-album', pour le distinguer d'une simple fermeture.
    console.log("Redirection vers l'album avec ID :", artistId);
    this.modalCtrl.dismiss(dataToPassBack, 'navigate-artist');
  }

  cancel() {
    this.modalCtrl.dismiss();
    this.modalStateService.setModalOpen(false);
  }
  ngOnDestroy() {
    this.modalStateService.setModalOpen(false);
  }
}
