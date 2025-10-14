import { IPlaylist, IPlaylistRaw } from './../../../core/interfaces/playlistes';
import { ISong } from '../../../core/interfaces/song';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  IonCol,
  IonGrid,
  IonImg,
  IonRow,
  ModalController,
} from '@ionic/angular/standalone';
import { ShareSongComponent } from '../button/share-song/share-song.component';
import { LikeSongComponent } from '../button/like-song/like-song.component';
import { SongOptionComponent } from '../button/song-option/song-option.component';
import { Router } from '@angular/router';
import { PlaySongPage } from '../../modal/play-song/play-song.page';
import { PlaylistContainerComponent } from '../containers/playlist-container/playlist-container.component';
import { MusicContainerComponent } from '../containers/music-container/music-container.component';

@Component({
  selector: 'app-display-item',
  templateUrl: './display-item.component.html',
  styleUrls: ['./display-item.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    ShareSongComponent,
    LikeSongComponent,
    SongOptionComponent,
    PlaySongPage,
    PlaylistContainerComponent,
    MusicContainerComponent,
  ],
})
export class DisplayItemComponent implements OnInit {
  constructor() {}
  router = inject(Router);
  modalCtrl = inject(ModalController);
  @Input() playlists: IPlaylistRaw[];
  @Input() songList: ISong[];
  ngOnInit() {
    console.log(this.songList);
  }

  async openSong() {
    const modal = await this.modalCtrl.create({
      component: PlaySongPage,
    });
    modal.present();
  }
  openPlaylist() {}

  redirectToPlaylist(playlistId: string) {
    this.router.navigate(['home/playlist/' + playlistId]);
  }
  isTypeOfIPlaylist(input: any): input is IPlaylistRaw[] {
    return Array.isArray(input) && input.every((item) => this.isPlaylist(item));
  }
  isPlaylist(item: any): item is IPlaylist {
    return (
      item &&
      typeof item === 'object' &&
      'id' in item &&
      'name' in item &&
      'songs' in item
    );
  }

  isTypeOfIMusicArray(input: any): input is ISong[] {
    return Array.isArray(input) && input.every((item) => this.isMusic(item));
  }

  // Garde de type pour vérifier qu'un élément est un objet IMusic
  isMusic(item: any): item is ISong {
    return (
      item &&
      typeof item === 'object' &&
      'id' in item &&
      'title' in item &&
      'artist' in item
    );
  }
}
