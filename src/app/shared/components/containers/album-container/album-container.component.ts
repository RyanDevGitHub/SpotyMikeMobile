import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonCol, IonImg, IonRow } from '@ionic/angular/standalone';
import { IAlbum } from 'src/app/core/interfaces/album';
import { IArtist } from 'src/app/core/interfaces/user';

import { LikeSongComponent } from '../../button/like-song/like-song.component';
import { ShareSongComponent } from '../../button/share-song/share-song.component';

@Component({
  selector: 'app-album-container',
  templateUrl: './album-container.component.html',
  styleUrls: ['./album-container.component.scss'],
  standalone: true,
  imports: [IonImg, IonRow, IonCol, LikeSongComponent, ShareSongComponent],
})
export class AlbumContainerComponent implements OnInit {
  @Input() album: IAlbum;
  artist: IArtist;
  duration: string;
  // en minutes

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.album && this.album.songs?.length) {
      const totalSeconds = this.album.songs.reduce((acc, song) => {
        // On suppose que song.duration est en secondes ou string convertible en nombre
        return acc + Number(song.duration);
      }, 0);

      // Convertir en minutes avec 2 décimales
      this.duration = (totalSeconds / 60).toFixed(2);
    } else {
      this.duration = '0';
    }
  }

  redirectToAlbum() {
    this.router.navigate(['/home/album/' + this.album.id]);
  }
}
