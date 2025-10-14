import { LikeSongComponent } from '../../button/like-song/like-song.component';
import { SongOptionComponent } from '../../button/song-option/song-option.component';
import { Component, OnInit, input, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonImg, IonRow, IonCol } from '@ionic/angular/standalone';
import { ShareSongComponent } from '../../button/share-song/share-song.component';

@Component({
  selector: 'app-playlist-container',
  templateUrl: './playlist-container.component.html',
  styleUrls: ['./playlist-container.component.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonImg,
    SongOptionComponent,
    ShareSongComponent,
    LikeSongComponent,
  ],
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
