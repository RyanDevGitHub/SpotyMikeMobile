import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonCol, IonImg, IonRow } from '@ionic/angular/standalone';

import { LikeSongComponent } from '../../button/like-song/like-song.component';
import { ShareSongComponent } from '../../button/share-song/share-song.component';

@Component({
  selector: 'app-playlist-container',
  templateUrl: './playlist-container.component.html',
  styleUrls: ['./playlist-container.component.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonImg, ShareSongComponent, LikeSongComponent],
})
export class PlaylistContainerComponent {
  @Input() nbSong: string;
  @Input() playlistName: string;
  @Input() cover: string;
  @Input() playlistId: string;

  constructor(private router: Router) {}

  redirectToPlaylist() {
    this.router.navigate(['/home/playlist/' + this.playlistId]);
  }
}
