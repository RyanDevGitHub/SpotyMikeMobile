import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonGrid, ModalController } from '@ionic/angular/standalone';
import { PlayContext } from 'src/app/core/interfaces/play-page-type';

import { IPlaylist, IPlaylistRaw } from '../../../core/interfaces/playlists';
import { ISong } from '../../../core/interfaces/song';
import { MusicContainerComponent } from '../containers/music-container/music-container.component';
import { PlaylistContainerComponent } from '../containers/playlist-container/playlist-container.component';

@Component({
  selector: 'app-display-item',
  templateUrl: './display-item.component.html',
  styleUrls: ['./display-item.component.scss'],
  standalone: true,
  imports: [IonGrid, PlaylistContainerComponent, MusicContainerComponent],
})
export class DisplayItemComponent implements OnInit {
  constructor() {}
  router = inject(Router);
  modalCtrl = inject(ModalController);
  @Input() playlists: IPlaylistRaw[];
  @Input() songList: ISong[];
  @Input() playContext: PlayContext;
  ngOnInit() {
    console.log(this.songList);
  }

  openPlaylist() {}

  redirectToPlaylist(playlistId: string) {
    this.router.navigate(['home/playlist/' + playlistId]);
  }
  isTypeOfIPlaylist(input: IPlaylist[]): input is IPlaylist[] {
    return Array.isArray(input) && input.every((item) => this.isPlaylist(item));
  }
  isPlaylist(item: IPlaylist): item is IPlaylist {
    return (
      item &&
      typeof item === 'object' &&
      'id' in item &&
      'name' in item &&
      'songs' in item
    );
  }

  isTypeOfIMusicArray(input: ISong[]): input is ISong[] {
    return Array.isArray(input) && input.every((item) => this.isMusic(item));
  }

  // Garde de type pour vérifier qu'un élément est un objet IMusic
  isMusic(item: ISong): item is ISong {
    return (
      item &&
      typeof item === 'object' &&
      'id' in item &&
      'title' in item &&
      'artist' in item
    );
  }
}
